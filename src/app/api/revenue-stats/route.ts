import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

/**
 * 수익 통계 조회 API (관리자용)
 * 플랫폼 전체 수익, 수행자 수익, 거래 통계 제공
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const timeRange = searchParams.get('range') || '30days' // 30days, 7days, today, all
        const performerId = searchParams.get('performerId') // 특정 수행자 통계

        let dateFilter = ''
        const now = new Date()

        switch (timeRange) {
            case 'today':
                dateFilter = `created_at >= '${new Date(now.setHours(0, 0, 0, 0)).toISOString()}'`
                break
            case '7days':
                const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
                dateFilter = `created_at >= '${sevenDaysAgo.toISOString()}'`
                break
            case '30days':
                const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
                dateFilter = `created_at >= '${thirtyDaysAgo.toISOString()}'`
                break
            case 'all':
            default:
                dateFilter = 'true' // No filter
        }

        // 1. 전체 거래 통계
        let query = supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('status', 'completed')

        if (performerId) {
            query = query.eq('payee_id', performerId)
        }

        const { data: transactions, error: transactionsError } = await query

        if (transactionsError) {
            throw transactionsError
        }

        // 2. 통계 계산
        const totalTransactions = transactions?.length || 0
        const totalRevenue = transactions?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0
        const totalPlatformFee = transactions?.reduce((sum, t) => sum + (Number(t.platform_fee) || Number(t.amount) * 0.30), 0) || 0
        const totalPerformerEarning = transactions?.reduce((sum, t) => sum + (Number(t.performer_earning) || Number(t.amount) * 0.70), 0) || 0

        // 3. 수행자별 통계
        const { data: performerStats, error: performerError } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, email, total_earnings, balance, completed_quests')
            .gt('total_earnings', 0)
            .order('total_earnings', { ascending: false })
            .limit(10)

        if (performerError) {
            console.error('Performer stats error:', performerError)
        }

        // 4. 일별 수익 추이 (최근 30일)
        const dailyStats: { [key: string]: { revenue: number; platformFee: number; performerEarning: number; count: number } } = {}

        transactions?.forEach(t => {
            const date = new Date(t.created_at).toISOString().split('T')[0]
            if (!dailyStats[date]) {
                dailyStats[date] = { revenue: 0, platformFee: 0, performerEarning: 0, count: 0 }
            }
            dailyStats[date].revenue += Number(t.amount) || 0
            dailyStats[date].platformFee += Number(t.platform_fee) || Number(t.amount) * 0.30
            dailyStats[date].performerEarning += Number(t.performer_earning) || Number(t.amount) * 0.70
            dailyStats[date].count += 1
        })

        const dailyStatsArray = Object.entries(dailyStats)
            .map(([date, stats]) => ({ date, ...stats }))
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 30)

        return NextResponse.json({
            success: true,
            timeRange: timeRange,
            summary: {
                totalTransactions,
                totalRevenue: totalRevenue.toFixed(2),
                platformRevenue: totalPlatformFee.toFixed(2),
                performerRevenue: totalPerformerEarning.toFixed(2),
                averageTransactionAmount: totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : '0',
                revenueSplitRatio: '70:30 (Performer:Platform)',
                platformFeePercentage: '30%',
                performerEarningPercentage: '70%',
            },
            topPerformers: performerStats || [],
            dailyTrends: dailyStatsArray,
            transactions: transactions?.slice(0, 50) || [], // 최근 50개 거래
        })

    } catch (error: any) {
        console.error('Revenue stats error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to get revenue statistics' },
            { status: 500 }
        )
    }
}

/**
 * 수행자 개인 수익 상세 조회
 */
export async function POST(req: NextRequest) {
    try {
        const { performerId } = await req.json()

        if (!performerId) {
            return NextResponse.json(
                { error: 'Missing performerId' },
                { status: 400 }
            )
        }

        // 수행자 프로필
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', performerId)
            .single()

        if (profileError || !profile) {
            return NextResponse.json(
                { error: 'Performer not found' },
                { status: 404 }
            )
        }

        // 수행자의 모든 거래
        const { data: transactions, error: transactionsError } = await supabaseAdmin
            .from('transactions')
            .select(`
                *,
                quests (
                    id,
                    title,
                    status
                )
            `)
            .eq('payee_id', performerId)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })

        if (transactionsError) {
            throw transactionsError
        }

        const totalEarned = transactions?.reduce((sum, t) => sum + (Number(t.performer_earning) || 0), 0) || 0
        const totalPlatformFees = transactions?.reduce((sum, t) => sum + (Number(t.platform_fee) || 0), 0) || 0

        return NextResponse.json({
            success: true,
            performer: {
                id: profile.id,
                name: profile.full_name,
                email: profile.email,
                totalEarnings: profile.total_earnings,
                currentBalance: profile.balance,
                completedQuests: profile.completed_quests,
            },
            earnings: {
                totalEarned: totalEarned.toFixed(2),
                totalPlatformFeesPaid: totalPlatformFees.toFixed(2),
                averageEarningPerQuest: profile.completed_quests > 0
                    ? (totalEarned / profile.completed_quests).toFixed(2)
                    : '0',
                earningRate: '70%',
            },
            transactions: transactions || [],
        })

    } catch (error: any) {
        console.error('Performer earnings error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to get performer earnings' },
            { status: 500 }
        )
    }
}
