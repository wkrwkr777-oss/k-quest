import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { questId, userId, rating, performerType, comment } = await request.json();

        // 평가 저장
        const { data, error } = await supabase.from('quest_ratings').insert([
            {
                quest_id: questId,
                user_id: userId,
                rating, // 1-5 stars
                performer_type: performerType, // 'ai' or 'human'
                comment,
                created_at: new Date().toISOString(),
            },
        ]);

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Rating submission error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to submit rating' },
            { status: 500 }
        );
    }
}

// 관리자용: 평가 통계 조회
export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabase
            .from('quest_ratings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // AI vs 인간 통계 계산
        const aiRatings = data.filter((r) => r.performer_type === 'ai');
        const humanRatings = data.filter((r) => r.performer_type === 'human');

        const stats = {
            total: data.length,
            ai: {
                count: aiRatings.length,
                avgRating: aiRatings.length > 0
                    ? (aiRatings.reduce((sum, r) => sum + r.rating, 0) / aiRatings.length).toFixed(2)
                    : 0,
            },
            human: {
                count: humanRatings.length,
                avgRating: humanRatings.length > 0
                    ? (humanRatings.reduce((sum, r) => sum + r.rating, 0) / humanRatings.length).toFixed(2)
                    : 0,
            },
            winner: aiRatings.length > humanRatings.length ? 'AI' : 'Human',
            summary: `AI 평균: ${aiRatings.length > 0
                ? (aiRatings.reduce((sum, r) => sum + r.rating, 0) / aiRatings.length).toFixed(2)
                : 0
                }⭐ (${aiRatings.length}건) vs 인간 평균: ${humanRatings.length > 0
                    ? (humanRatings.reduce((sum, r) => sum + r.rating, 0) / humanRatings.length).toFixed(2)
                    : 0
                }⭐ (${humanRatings.length}건)`,
        };

        return NextResponse.json({ stats, data });
    } catch (error: any) {
        console.error('Rating fetch error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch ratings' },
            { status: 500 }
        );
    }
}
