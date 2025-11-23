// 리뷰 및 평점 시스템
import { supabase } from './supabase';

export interface Review {
    id: string;
    quest_id: string;
    reviewer_id: string;
    reviewee_id: string;
    rating: number;
    comment: string;
    created_at: string;
    reviewer_name?: string;
    reviewer_avatar?: string;
}

/**
 * 리뷰 작성
 */
export async function createReview(
    questId: string,
    reviewerId: string,
    revieweeId: string,
    rating: number,
    comment: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // 검증: 평점은 1-5 사이
        if (rating < 1 || rating > 5) {
            return { success: false, error: '평점은 1-5 사이여야 합니다.' };
        }

        // 검증: 코멘트 길이
        if (comment.length < 10) {
            return { success: false, error: '리뷰는 최소 10자 이상이어야 합니다.' };
        }

        if (comment.length > 500) {
            return { success: false, error: '리뷰는 최대 500자까지 가능합니다.' };
        }

        // 중복 리뷰 확인
        const { data: existing } = await supabase
            .from('reviews')
            .select('id')
            .eq('quest_id', questId)
            .eq('reviewer_id', reviewerId)
            .eq('reviewee_id', revieweeId)
            .single();

        if (existing) {
            return { success: false, error: '이미 리뷰를 작성하셨습니다.' };
        }

        // 리뷰 생성
        const { error } = await supabase.from('reviews').insert({
            quest_id: questId,
            reviewer_id: reviewerId,
            reviewee_id: revieweeId,
            rating,
            comment,
        });

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Failed to create review:', error);
        return { success: false, error: '리뷰 작성에 실패했습니다.' };
    }
}

/**
 * 사용자의 리뷰 목록 가져오기
 */
export async function getUserReviews(
    userId: string,
    limit = 20
): Promise<Review[]> {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(
                `
        *,
        reviewer:profiles!reviewer_id(full_name, avatar_url)
      `
            )
            .eq('reviewee_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return (
            data?.map((r: any) => ({
                ...r,
                reviewer_name: r.reviewer?.full_name || 'Anonymous',
                reviewer_avatar: r.reviewer?.avatar_url,
            })) || []
        );
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return [];
    }
}

/**
 * Quest의 리뷰 목록 가져오기
 */
export async function getQuestReviews(questId: string): Promise<Review[]> {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(
                `
        *,
        reviewer:profiles!reviewer_id(full_name, avatar_url)
      `
            )
            .eq('quest_id', questId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (
            data?.map((r: any) => ({
                ...r,
                reviewer_name: r.reviewer?.full_name || 'Anonymous',
                reviewer_avatar: r.reviewer?.avatar_url,
            })) || []
        );
    } catch (error) {
        console.error('Failed to fetch quest reviews:', error);
        return [];
    }
}

/**
 * 사용자의 평균 평점 가져오기
 */
export async function getUserRating(userId: string): Promise<number> {
    try {
        const { data } = await supabase
            .from('profiles')
            .select('rating')
            .eq('id', userId)
            .single();

        return data?.rating || 0;
    } catch (error) {
        console.error('Failed to fetch user rating:', error);
        return 0;
    }
}

/**
 * 리뷰 신고
 */
export async function reportReview(
    reviewId: string,
    reporterId: string,
    reason: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // 관리자에게 알림 (구현은 나중에)
        console.log('Review reported:', { reviewId, reporterId, reason });

        return { success: true };
    } catch (error) {
        console.error('Failed to report review:', error);
        return { success: false, error: '리뷰 신고에 실패했습니다.' };
    }
}

/**
 * 별점 평균 계산 헬퍼 함수
 */
export function calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
}

/**
 * 별점 분포 계산
 */
export function getRatingDistribution(reviews: Review[]): {
    [key: number]: number;
} {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
        distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
}
