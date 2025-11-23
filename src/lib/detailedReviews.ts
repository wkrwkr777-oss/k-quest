// 상세 평가 시스템 - 투명하고 정확한 평가export interface DetailedReview {
id: string;
quest_id: string;
reviewer_id: string;
reviewee_id: string;

// 5가지 핵심 평가 항목 (각 1-5점)
task_completion: number;        // 임무 완수도
communication: number;           // 소통 원활성
professionalism: number;         // 전문성 & 태도
punctuality: number;             // 시간 약속 준수
value_for_money: number;         // 가격 대비 만족도

// 전체 평점 (자동 계산)
overall_rating: number;

// 상세 코멘트
comment: string;

// 장점/개선점
pros: string[];
cons: string[];

// 추천 여부
would_recommend: boolean;

created_at: string;
}

/**
 * 상세 평가 생성
 */
export async function createDetailedReview(
    questId: string,
    reviewerId: string,
    revieweeId: string,
    ratings: {
        task_completion: number;
        communication: number;
        professionalism: number;
        punctuality: number;
        value_for_money: number;
    },
    comment: string,
    pros: string[],
    cons: string[],
    wouldRecommend: boolean
): Promise<{ success: boolean; error?: string }> {
    try {
        // 모든 평점이 1-5 사이인지 검증
        const ratingValues = Object.values(ratings);
        const allValid = ratingValues.every(r => r >= 1 && r <= 5);

        if (!allValid) {
            return { success: false, error: '평점은 1-5 사이여야 합니다.' };
        }

        // 전체 평점 계산 (5개 항목 평균)
        const overallRating = ratingValues.reduce((sum, r) => sum + r, 0) / 5;

        // 중복 리뷰 확인
        const { data: existing } = await supabase
            .from('detailed_reviews')
            .select('id')
            .eq('quest_id', questId)
            .eq('reviewer_id', reviewerId)
            .single();

        if (existing) {
            return { success: false, error: '이미 리뷰를 작성하셨습니다.' };
        }

        // 리뷰 생성
        const { error } = await supabase.from('detailed_reviews').insert({
            quest_id: questId,
            reviewer_id: reviewerId,
            reviewee_id: revieweeId,
            task_completion: ratings.task_completion,
            communication: ratings.communication,
            professionalism: ratings.professionalism,
            punctuality: ratings.punctuality,
            value_for_money: ratings.value_for_money,
            overall_rating: Number(overallRating.toFixed(2)),
            comment,
            pros,
            cons,
            would_recommend: wouldRecommend,
        });

        if (error) throw error;

        // 피평가자의 상세 평점 업데이트
        await updateUserDetailedRatings(revieweeId);

        return { success: true };
    } catch (error) {
        console.error('Failed to create detailed review:', error);
        return { success: false, error: '리뷰 작성에 실패했습니다.' };
    }
}

/**
 * 사용자의 상세 평점 업데이트
 */
async function updateUserDetailedRatings(userId: string): Promise<void> {
    try {
        // 모든 리뷰 가져오기
        const { data: reviews } = await supabase
            .from('detailed_reviews')
            .select('*')
            .eq('reviewee_id', userId);

        if (!reviews || reviews.length === 0) return;

        // 각 항목 평균 계산
        const avgTaskCompletion = reviews.reduce((sum, r) => sum + r.task_completion, 0) / reviews.length;
        const avgCommunication = reviews.reduce((sum, r) => sum + r.communication, 0) / reviews.length;
        const avgProfessionalism = reviews.reduce((sum, r) => sum + r.professionalism, 0) / reviews.length;
        const avgPunctuality = reviews.reduce((sum, r) => sum + r.punctuality, 0) / reviews.length;
        const avgValueForMoney = reviews.reduce((sum, r) => sum + r.value_for_money, 0) / reviews.length;
        const avgOverall = reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length;

        // 추천율 계산
        const recommendCount = reviews.filter(r => r.would_recommend).length;
        const recommendationRate = (recommendCount / reviews.length) * 100;

        // 프로필 업데이트
        await supabase
            .from('profiles')
            .update({
                rating: Number(avgOverall.toFixed(2)),
                rating_task_completion: Number(avgTaskCompletion.toFixed(2)),
                rating_communication: Number(avgCommunication.toFixed(2)),
                rating_professionalism: Number(avgProfessionalism.toFixed(2)),
                rating_punctuality: Number(avgPunctuality.toFixed(2)),
                rating_value: Number(avgValueForMoney.toFixed(2)),
                recommendation_rate: Number(recommendationRate.toFixed(1)),
                review_count: reviews.length,
            })
            .eq('id', userId);
    } catch (error) {
        console.error('Failed to update user detailed ratings:', error);
    }
}

/**
 * 사용자의 상세 평가 프로필
 */
export async function getUserDetailedProfile(userId: string) {
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select(`
        rating,
        rating_task_completion,
        rating_communication,
        rating_professionalism,
        rating_punctuality,
        rating_value,
        recommendation_rate,
        review_count,
        completed_quests
      `)
            .eq('id', userId)
            .single();

        return profile || null;
    } catch (error) {
        console.error('Failed to get user detailed profile:', error);
        return null;
    }
}

/**
 * 상세 리뷰 목록
 */
export async function getDetailedReviews(
    userId: string,
    limit = 20
): Promise<DetailedReview[]> {
    try {
        const { data, error } = await supabase
            .from('detailed_reviews')
            .select(`
        *,
        reviewer:profiles!reviewer_id(full_name, avatar_url),
        quest:quests(title)
      `)
            .eq('reviewee_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Failed to get detailed reviews:', error);
        return [];
    }
}

/**
 * 평가 통계
 */
export function calculateReviewStats(reviews: DetailedReview[]) {
    if (reviews.length === 0) {
        return {
            totalReviews: 0,
            averageRating: 0,
            recommendationRate: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            categoryAverages: {
                taskCompletion: 0,
                communication: 0,
                professionalism: 0,
                punctuality: 0,
                valueForMoney: 0,
            },
        };
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.overall_rating, 0) / totalReviews;
    const recommendCount = reviews.filter(r => r.would_recommend).length;
    const recommendationRate = (recommendCount / totalReviews) * 100;

    // 별점 분포
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
        const rounded = Math.round(r.overall_rating) as 1 | 2 | 3 | 4 | 5;
        ratingDistribution[rounded]++;
    });

    // 카테고리별 평균
    const categoryAverages = {
        taskCompletion: reviews.reduce((sum, r) => sum + r.task_completion, 0) / totalReviews,
        communication: reviews.reduce((sum, r) => sum + r.communication, 0) / totalReviews,
        professionalism: reviews.reduce((sum, r) => sum + r.professionalism, 0) / totalReviews,
        punctuality: reviews.reduce((sum, r) => sum + r.punctuality, 0) / totalReviews,
        valueForMoney: reviews.reduce((sum, r) => sum + r.value_for_money, 0) / totalReviews,
    };

    return {
        totalReviews,
        averageRating: Number(averageRating.toFixed(2)),
        recommendationRate: Number(recommendationRate.toFixed(1)),
        ratingDistribution,
        categoryAverages: {
            taskCompletion: Number(categoryAverages.taskCompletion.toFixed(2)),
            communication: Number(categoryAverages.communication.toFixed(2)),
            professionalism: Number(categoryAverages.professionalism.toFixed(2)),
            punctuality: Number(categoryAverages.punctuality.toFixed(2)),
            valueForMoney: Number(categoryAverages.valueForMoney.toFixed(2)),
        },
    };
}

// Supabase 테이블:
/*
CREATE TABLE detailed_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id) NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) NOT NULL,
  reviewee_id uuid REFERENCES profiles(id) NOT NULL,
  task_completion numeric(3,2) CHECK (task_completion >= 1 AND task_completion <= 5),
  communication numeric(3,2) CHECK (communication >= 1 AND communication <= 5),
  professionalism numeric(3,2) CHECK (professionalism >= 1 AND professionalism <= 5),
  punctuality numeric(3,2) CHECK (punctuality >= 1 AND punctuality <= 5),
  value_for_money numeric(3,2) CHECK (value_for_money >= 1 AND value_for_money <= 5),
  overall_rating numeric(3,2),
  comment text NOT NULL,
  pros text[],
  cons text[],
  would_recommend boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(quest_id, reviewer_id, reviewee_id)
);

-- profiles 테이블에 추가
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS rating_task_completion numeric(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_communication numeric(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_professionalism numeric(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_punctuality numeric(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_value numeric(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS recommendation_rate numeric(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;
*/
