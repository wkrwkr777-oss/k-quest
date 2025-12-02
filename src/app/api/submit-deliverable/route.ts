import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

/**
 * Quest 결과물 제출 API (수행자용)
 * 미리보기만 공개, 전체 내용은 결제 후에만 공개
 */
export async function POST(req: NextRequest) {
    try {
        const {
            questId,
            performerId,
            previewTitle,
            previewDescription,
            previewImages,
            fullContent,
            fullImages,
            attachments,
        } = await req.json()

        // 입력 검증
        if (!questId || !performerId || !previewTitle) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Quest 확인
        const { data: quest, error: questError } = await supabaseAdmin
            .from('quests')
            .select('*')
            .eq('id', questId)
            .eq('performer_id', performerId)
            .single()

        if (questError || !quest) {
            return NextResponse.json(
                { error: 'Quest not found or unauthorized' },
                { status: 404 }
            )
        }

        if (quest.status !== 'in_progress') {
            return NextResponse.json(
                { error: `Cannot submit deliverable. Quest status: ${quest.status}` },
                { status: 400 }
            )
        }

        // 미리보기 설명 길이 제한 (200자)
        const limitedPreview = previewDescription
            ? previewDescription.substring(0, 200) + (previewDescription.length > 200 ? '...' : '')
            : ''

        // 언락 비밀번호 생성 (결제 완료 시 사용)
        const unlockPassword = crypto.randomBytes(32).toString('hex')

        // 결과물 제출
        const { data: deliverable, error: deliverableError } = await supabaseAdmin
            .from('quest_deliverables')
            .insert({
                quest_id: questId,
                performer_id: performerId,
                preview_title: previewTitle,
                preview_description: limitedPreview,
                preview_images: previewImages || [],
                full_content: fullContent,
                full_images: fullImages || [],
                attachments: attachments || [],
                is_preview_mode: true, // 기본적으로 미리보기만 공개
                is_paid: false,
                unlock_password: unlockPassword,
                status: 'submitted',
            })
            .select()
            .single()

        if (deliverableError) {
            console.error('Deliverable creation error:', deliverableError)
            throw deliverableError
        }

        // 에스크로 락 생성 (7일 후 자동 승인)
        const autoReleaseDays = 7
        const autoReleaseAt = new Date()
        autoReleaseAt.setDate(autoReleaseAt.getDate() + autoReleaseDays)

        // 거래 정보 가져오기
        const { data: transaction } = await supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('quest_id', questId)
            .eq('status', 'completed')
            .single()

        if (transaction) {
            await supabaseAdmin
                .from('escrow_locks')
                .insert({
                    quest_id: questId,
                    transaction_id: transaction.id,
                    locked_amount: transaction.amount,
                    status: 'locked',
                    auto_release_at: autoReleaseAt.toISOString(),
                    auto_release_days: autoReleaseDays,
                    performer_submitted: true,
                    client_approved: false,
                })
        }

        // 의뢰자에게 알림
        await supabaseAdmin
            .from('notifications')
            .insert({
                user_id: quest.client_id,
                type: 'deliverable_submitted',
                title: '📦 Quest 결과물이 제출되었습니다',
                message: `"${quest.title}" Quest의 결과물이 제출되었습니다. ${autoReleaseDays}일 이내에 확인해주세요.`,
                link: `/quests/${questId}/review`,
            })

        // 수행자에게 확인 알림
        await supabaseAdmin
            .from('notifications')
            .insert({
                user_id: performerId,
                type: 'deliverable_submitted_confirmation',
                title: '✅ 결과물이 제출되었습니다',
                message: `결과물이 안전하게 제출되었습니다. ${autoReleaseDays}일 후 자동 승인됩니다.`,
                link: `/quests/${questId}`,
            })

        return NextResponse.json({
            success: true,
            message: 'Deliverable submitted successfully',
            data: {
                deliverableId: deliverable.id,
                questId: questId,
                autoApprovalDate: autoReleaseAt,
                daysUntilAutoApproval: autoReleaseDays,
                protection: {
                    previewOnly: true,
                    fullContentLocked: true,
                    unlockCondition: 'Client must approve and complete payment',
                },
            },
        })

    } catch (error: any) {
        console.error('Submit deliverable error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to submit deliverable' },
            { status: 500 }
        )
    }
}

/**
 * 결과물 조회 API
 * 의뢰자: 미리보기만 볼 수 있음
 * 수행자: 전체 볼 수 있음
 * 결제 완료: 의뢰자도 전체 볼 수 있음
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const deliverableId = searchParams.get('deliverableId')
        const questId = searchParams.get('questId')
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId' },
                { status: 400 }
            )
        }

        let query = supabaseAdmin
            .from('quest_deliverables')
            .select(`
                *,
                quests (
                    id,
                    title,
                    client_id,
                    performer_id,
                    status
                )
            `)

        if (deliverableId) {
            query = query.eq('id', deliverableId)
        } else if (questId) {
            query = query.eq('quest_id', questId)
        } else {
            return NextResponse.json(
                { error: 'Missing deliverableId or questId' },
                { status: 400 }
            )
        }

        const { data: deliverable, error } = await query.single()

        if (error || !deliverable) {
            return NextResponse.json(
                { error: 'Deliverable not found' },
                { status: 404 }
            )
        }

        const quest = deliverable.quests as any
        const isPerformer = quest.performer_id === userId
        const isClient = quest.client_id === userId
        const isPaid = deliverable.is_paid

        // 접근 로그 기록
        await supabaseAdmin
            .from('deliverable_access_logs')
            .insert({
                deliverable_id: deliverable.id,
                accessed_by: userId,
                access_type: isPaid ? 'full_view' : 'preview',
            })

        // 수행자는 항상 전체 볼 수 있음
        if (isPerformer) {
            return NextResponse.json({
                success: true,
                data: deliverable,
                accessLevel: 'full',
            })
        }

        // 의뢰자는 결제 완료 시에만 전체 볼 수 있음
        if (isClient) {
            if (isPaid) {
                return NextResponse.json({
                    success: true,
                    data: deliverable,
                    accessLevel: 'full',
                    message: 'Payment completed. Full content unlocked.',
                })
            } else {
                // 미리보기만 제공
                return NextResponse.json({
                    success: true,
                    data: {
                        id: deliverable.id,
                        quest_id: deliverable.quest_id,
                        preview_title: deliverable.preview_title,
                        preview_description: deliverable.preview_description,
                        preview_images: deliverable.preview_images,
                        status: deliverable.status,
                        submitted_at: deliverable.submitted_at,
                        // 전체 내용은 숨김
                        full_content: '[🔒 결제 승인 후 공개됩니다]',
                        full_images: ['[🔒 Locked]'],
                        attachments: ['[🔒 Locked]'],
                    },
                    accessLevel: 'preview_only',
                    message: '미리보기만 제공됩니다. 결제 승인 후 전체 내용이 공개됩니다.',
                    warning: '⚠️ 결제 승인 없이 먹튀 시 블랙리스트 처리됩니다.',
                })
            }
        }

        return NextResponse.json(
            { error: 'Unauthorized access' },
            { status: 403 }
        )

    } catch (error: any) {
        console.error('Get deliverable error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to get deliverable' },
            { status: 500 }
        )
    }
}
