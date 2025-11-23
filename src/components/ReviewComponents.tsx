"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { createReview } from '@/lib/reviews';
import { Button } from './ui/Button';

interface ReviewFormProps {
    questId: string;
    reviewerId: string;
    revieweeId: string;
    revieweeName: string;
    onSuccess?: () => void;
}

export function ReviewForm({
    questId,
    reviewerId,
    revieweeId,
    revieweeName,
    onSuccess,
}: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('평점을 선택해주세요.');
            return;
        }

        setIsSubmitting(true);

        const result = await createReview(
            questId,
            reviewerId,
            revieweeId,
            rating,
            comment
        );

        setIsSubmitting(false);

        if (result.success) {
            setRating(0);
            setComment('');
            onSuccess?.();
        } else {
            setError(result.error || '리뷰 작성에 실패했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#111] border border-[#333] p-6 rounded-lg">
            <h3 className="text-xl font-serif text-white mb-4">
                {revieweeName}님에 대한 리뷰 작성
            </h3>

            {/* Star Rating */}
            <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">평점</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= (hoverRating || rating)
                                        ? 'fill-[#D4AF37] text-[#D4AF37]'
                                        : 'text-gray-600'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">
                    리뷰 내용 (10-500자)
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Quest 경험에 대해 자세히 알려주세요..."
                    className="w-full bg-[#262626] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-600 min-h-[120px] resize-none"
                    maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                    {comment.length}/500
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Submit */}
            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || rating === 0}
                className="w-full"
            >
                {isSubmitting ? '제출 중...' : '리뷰 제출'}
            </Button>
        </form>
    );
}

interface ReviewDisplayProps {
    reviews: Array<{
        id: string;
        rating: number;
        comment: string;
        created_at: string;
        reviewer_name?: string;
        reviewer_avatar?: string;
    }>;
}

export function ReviewDisplay({ reviews }: ReviewDisplayProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>아직 리뷰가 없습니다</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-[#111] border border-[#333] p-6 rounded-lg hover:border-[#D4AF37]/30 transition-colors"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold">
                                {review.reviewer_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="text-white font-medium">
                                    {review.reviewer_name || 'Anonymous'}
                                </p>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating
                                                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                                                    : 'text-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('ko-KR')}
                        </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}
