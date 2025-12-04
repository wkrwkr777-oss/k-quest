// ============================================
// 관리자 통계 API
// ============================================

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getFraudStats } from '@/lib/fraudDetection';

export async function GET() {
    try {
        // Supabase View에서 기본 통계 가져오기
        const { data: stats } = await supabase
            .from('admin_dashboard_stats')
            .select('*')
            .single();

        // 사기 탐지 통계
        const fraudStats = await getFraudStats();

        // 최근 7일 가입자 추이
        const { data: weeklySignups } = await supabase
            .rpc('get_weekly_signups');

        // 최근 SOS 신고
        const { data: recentSOS } = await supabase
            .from('sos_reports')
            .select(`
        *,
        reporter:profiles!reporter_id(full_name),
        quest:quests(title)
      `)
            .eq('status', 'open')
            .order('created_at', { ascending: false })
            .limit(5);

        // 응답
        return NextResponse.json({
            success: true,
            data: {
                // 기본 통계
                totalUsers: stats?.total_users || 0,
                newUsersWeek: stats?.new_users_week || 0,
                totalQuests: stats?.total_quests || 0,
                completedQuests: stats?.completed_quests || 0,
                activeQuests: stats?.active_quests || 0,
                totalRevenue: parseFloat(stats?.total_revenue || '0'),
                platformEarnings: parseFloat(stats?.platform_earnings || '0'),

                // 사기 탐지
                fraud: {
                    totalChecks: fraudStats.totalChecks,
                    aiChecks: fraudStats.aiChecks,
                    ruleChecks: fraudStats.ruleChecks,
                    suspiciousFound: fraudStats.suspiciousFound,
                    aiUsagePercent: fraudStats.totalChecks > 0
                        ? Math.round((fraudStats.aiChecks / fraudStats.totalChecks) * 100)
                        : 0
                },

                // SOS
                openSOS: recentSOS || [],

                // 추이
                weeklySignups: weeklySignups || []
            }
        });

    } catch (error) {
        console.error('Failed to get admin stats:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to load statistics'
        }, { status: 500 });
    }
}
