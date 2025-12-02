import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * 의뢰자가 결과물을 승인하는 API
 * 승인 시 전체 내용 공개 & 수행자에게 자동 지급
 */
export async function POST(req: NextRequest) {
    try {
        const { deliverableId, questId, clientId, approved, rejectionReason } = await req.json()

        if (!deliverableId || !questId || !clientId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Quest 확인 (의뢰자인지 검증)
        const { data: quest, error: questError } = await supabaseAdmin
            .from('quests')
            .select('*')
            .eq('id', questId)
            .eq('client_id', clientId)
            .single()

        if (questError || !quest) {
            return NextResponse.json(
                { error: 'Quest not found or unauthorized' },
                { status: 404 }
            )
        }

        // 결과물 확인
        const { data: deliverable, error: deliverableError } = await supabaseAdmin
            .from('quest_deliverables')
            .select('*')
            .eq('id', deliverableId)
            .eq('quest_id', questId)
            .single()

        if (deliverableError || !deliverable) {
            return NextResponse.json(
                { error: 'Deliverable not found' },
                { status: 404 }
            )
        }

        if (approved === true) {
            // ✅ 승인 처리

            // 1. 결과물 전체 공개
            await supabaseAdmin
                .from('quest_deliverables')
                .update({
                    is_preview_mode: false,
                    is_paid: true,
                    status: 'approved',
                    reviewed_at: new Date().toISOString(),
                    unlocked_at: new Date().toISOString(),
                })
                .eq('id', deliverableId)

            // 2. 에스크로 릴리즈
            const { data: escrowLock } = await supabaseAdmin
                .from('escrow_locks')
                .select('*')
                .eq('quest_id', questId)
                .single()

            if (escrowLock) {
                await supabaseAdmin
                    .from('escrow_locks')
                    .update({
                        status: 'released_to_performer',
                        client_approved: true,
                        released_at: new Date().toISOString(),
                    })
                    .eq('id', escrowLock.id)

                // 3. 수행자에게 지급 (기존 complete-quest API 호출)
                const amount = escrowLock.locked_amount
                const performerEarning = amount * 0.70
                const platformFee = amount * 0.30

                // 수행자 잔액 업데이트
                const { data: currentProfile } = await supabaseAdmin
                    .from('profiles')
                    .select('balance, total_earnings, completed_quests')
                    .eq('id', quest.performer_id)
                    .single()

                if (currentProfile) {
                    await supabaseAdmin
                        .from('profiles')
                        .update({
                            balance: Number(currentProfile.balance || 0) + performerEarning,
                            total_earnings: Number(currentProfile.total_earnings || 0) + performerEarning,
                            completed_quests: (currentProfile.completed_quests || 0) + 1,
                        })
                        .eq('id', quest.performer_id)
                }

                // Quest 완료 처리
                await supabaseAdmin
                    .from('quests')
                    .update({
                        status: 'completed',
                        completed_at: new Date().toISOString(),
                    })
                    .eq('id', questId)

                // Transaction 업데이트
                if (escrowLock.transaction_id) {
                    await supabaseAdmin
                        .from('transactions')
                        .update({
                            status: 'completed',
                            completed_at: new Date().toISOString(),
                            payee_id: quest.performer_id,
                        })
                        .eq('id', escrowLock.transaction_id)
                }
            }

            // 4. 의뢰자 신뢰도 향상
            await supabaseAdmin.rpc('update_client_reputation', {})

            // 5. 수행자에게 알림
            await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: quest.performer_id,
                    type: 'deliverable_approved',
                    title: '🎉 결과물이 승인되었습니다!',
                    message: `"${quest.title}" Quest가 승인되어 수익이 지급되었습니다.`,
                    link: `/quests/${questId}`,
                })

            // 6. 의뢰자에게 확인 알림
            await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: clientId,
                    type: 'approval_confirmed',
                    title: '✅ 승인이 완료되었습니다',
                    message: `"${quest.title}" Quest의 전체 내용이 이제 열람 가능합니다.`,
                    link: `/quests/${questId}`,
                })

            return NextResponse.json({
                success: true,
                message: 'Deliverable approved and payment released',
                data: {
                    deliverableId,
                    questId,
                    status: 'approved',
                    fullContentUnlocked: true,
                    paymentReleased: true,
                },
            })

        } else if (approved === false) {
            // ❌ 거부 처리

            if (!rejectionReason) {
                return NextResponse.json(
                    { error: 'Rejection reason is required' },
                    { status: 400 }
                )
            }

            // 결과물 거부
            await supabaseAdmin
                .from('quest_deliverables')
                .update({
                    status: 'rejected',
                    reviewed_at: new Date().toISOString(),
                })
                .eq('id', deliverableId)

            // 수행자에게 알림 (재작업 요청)
            await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: quest.performer_id,
                    type: 'deliverable_rejected',
                    title: '🔄 재작업이 필요합니다',
                    message: `"${quest.title}" 결과물이 거부되었습니다. 사유: ${rejectionReason}`,
                    link: `/quests/${questId}`,
                })

            // 의뢰자 신뢰도 감소 (거부가 많으면)
            const { data: rejectionCount } = await supabaseAdmin
                .from('quest_deliverables')
                .select('id', { count: 'exact' })
                .eq('quest_id', questId)
                .eq('status', 'rejected')

            if (rejectionCount && rejectionCount.length > 2) {
                // 3번 이상 거부하면 의심스러운 패턴
                // 현재 신뢰도 정보 가져오기
                const { data: currentReputation } = await supabaseAdmin
                    .from('client_reputation')
                    .select('suspicious_pattern_count, warning_count')
                    .eq('client_id', clientId)
                    .single()

                const currentSuspicious = currentReputation?.suspicious_pattern_count || 0
                const currentWarning = currentReputation?.warning_count || 0

                await supabaseAdmin
                    .from('client_reputation')
                    .update({
                        suspicious_pattern_count: currentSuspicious + 1,
                        warning_count: currentWarning + 1,
                        last_suspicious_activity: new Date().toISOString(),
                    })
                    .eq('client_id', clientId)
            }

            return NextResponse.json({
                success: true,
                message: 'Deliverable rejected. Performer has been notified.',
                data: {
                    deliverableId,
                    questId,
                    status: 'rejected',
                    reason: rejectionReason,
                },
            })

        } else {
            return NextResponse.json(
                { error: 'Invalid approval status' },
                { status: 400 }
            )
        }

    } catch (error: any) {
        console.error('Approve deliverable error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to process approval' },
            { status: 500 }
        )
    }
}

/**
 * 승인 상태 조회 API
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const questId = searchParams.get('questId')

        if (!questId) {
            return NextResponse.json(
                { error: 'Missing questId' },
                { status: 400 }
            )
        }

        // 에스크로 상태 확인
        const { data: escrowLock } = await supabaseAdmin
            .from('escrow_locks')
            .select('*')
            .eq('quest_id', questId)
            .single()

        // 결과물 상태 확인
        const { data: deliverable } = await supabaseAdmin
            .from('quest_deliverables')
            .select('*')
            .eq('quest_id', questId)
            .order('submitted_at', { ascending: false })
            .limit(1)
            .single()

        const now = new Date()
        const autoReleaseAt = escrowLock?.auto_release_at
            ? new Date(escrowLock.auto_release_at)
            : null

        const hoursUntilAutoApproval = autoReleaseAt
            ? Math.max(0, (autoReleaseAt.getTime() - now.getTime()) / (1000 * 60 * 60))
            : null

        return NextResponse.json({
            success: true,
            data: {
                questId,
                escrowStatus: escrowLock?.status || 'none',
                deliverableStatus: deliverable?.status || 'not_submitted',
                clientApproved: escrowLock?.client_approved || false,
                autoReleaseAt: autoReleaseAt?.toISOString() || null,
                hoursUntilAutoApproval: hoursUntilAutoApproval
                    ? Math.round(hoursUntilAutoApproval * 10) / 10
                    : null,
                isFullContentUnlocked: deliverable?.is_paid || false,
            },
        })

    } catch (error: any) {
        console.error('Get approval status error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to get approval status' },
            { status: 500 }
        )
    }
}
