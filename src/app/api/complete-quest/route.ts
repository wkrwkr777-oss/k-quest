import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

/**
 * Quest 완료 및 자동 수익 정산 API
 * 수행자에게 70% 자동 지급, 플랫폼은 30% 수수료
 */
export async function POST(req: NextRequest) {
    try {
        const { questId, transactionId } = await req.json()

        if (!questId || !transactionId) {
            return NextResponse.json(
                { error: 'Missing questId or transactionId' },
                { status: 400 }
            )
        }

        // Quest 정보 가져오기
        const { data: quest, error: questError } = await supabaseAdmin
            .from('quests')
            .select('*')
            .eq('id', questId)
            .single()

        if (questError || !quest) {
            return NextResponse.json(
                { error: 'Quest not found' },
                { status: 404 }
            )
        }

        if (quest.status !== 'in_progress') {
            return NextResponse.json(
                { error: `Quest is not in progress. Current status: ${quest.status}` },
                { status: 400 }
            )
        }

        // Transaction 정보 가져오기
        const { data: transaction, error: transactionError } = await supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('id', transactionId)
            .single()

        if (transactionError || !transaction) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            )
        }

        if (transaction.status === 'completed') {
            return NextResponse.json(
                { error: 'Transaction already completed' },
                { status: 400 }
            )
        }

        const performerId = quest.performer_id
        if (!performerId) {
            return NextResponse.json(
                { error: 'No performer assigned to this quest' },
                { status: 400 }
            )
        }

        const amount = transaction.amount
        const performerEarning = transaction.performer_earning || (amount * 0.70)
        const platformFee = transaction.platform_fee || (amount * 0.30)

        // 1. 현재 프로필 정보 가져오기
        const { data: currentProfile, error: fetchError } = await supabaseAdmin
            .from('profiles')
            .select('balance, total_earnings, completed_quests')
            .eq('id', performerId)
            .single()

        if (fetchError || !currentProfile) {
            return NextResponse.json(
                { error: 'Performer profile not found' },
                { status: 404 }
            )
        }

        // 2. 수행자 잔액 업데이트 (70% 자동 지급)
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
                balance: Number(currentProfile.balance || 0) + performerEarning,
                total_earnings: Number(currentProfile.total_earnings || 0) + performerEarning,
                completed_quests: (currentProfile.completed_quests || 0) + 1,
            })
            .eq('id', performerId)

        if (profileError) {
            console.error('Profile update error:', profileError)
            throw profileError
        }

        // 2. Quest 상태를 completed로 변경
        const { error: questUpdateError } = await supabaseAdmin
            .from('quests')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
            })
            .eq('id', questId)

        if (questUpdateError) {
            console.error('Quest update error:', questUpdateError)
            throw questUpdateError
        }

        // 3. Transaction 상태 업데이트
        const { error: transactionUpdateError } = await supabaseAdmin
            .from('transactions')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                payee_id: performerId,
            })
            .eq('id', transactionId)

        if (transactionUpdateError) {
            console.error('Transaction update error:', transactionUpdateError)
            throw transactionUpdateError
        }

        // 4. 수행자에게 알림 전송
        await supabaseAdmin
            .from('notifications')
            .insert({
                user_id: performerId,
                type: 'payment_received',
                title: '💰 수익이 지급되었습니다',
                message: `Quest 완료로 ₩${performerEarning.toLocaleString()}를 받았습니다 (플랫폼 수수료 30% 차감 후)`,
                link: `/quests/${questId}`,
            })

        // 5. 의뢰자에게도 알림
        if (quest.client_id) {
            await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: quest.client_id,
                    type: 'quest_completed',
                    title: '✅ Quest가 완료되었습니다',
                    message: `"${quest.title}" Quest가 성공적으로 완료되었습니다.`,
                    link: `/quests/${questId}`,
                })
        }

        // 성공 응답
        return NextResponse.json({
            success: true,
            message: 'Quest completed and payment settled',
            data: {
                questId: questId,
                performerId: performerId,
                totalAmount: amount,
                performerEarning: performerEarning,
                platformFee: platformFee,
                revenueSplit: '70:30',
                status: 'completed',
            },
        })

    } catch (error: any) {
        console.error('Quest completion error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to complete quest and settle payment' },
            { status: 500 }
        )
    }
}

/**
 * Quest 상태 조회 API
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

        // Quest와 관련 Transaction 정보 가져오기
        const { data: quest, error: questError } = await supabaseAdmin
            .from('quests')
            .select(`
                *,
                transactions (*)
            `)
            .eq('id', questId)
            .single()

        if (questError || !quest) {
            return NextResponse.json(
                { error: 'Quest not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: quest,
        })

    } catch (error: any) {
        console.error('Quest status error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to get quest status' },
            { status: 500 }
        )
    }
}
