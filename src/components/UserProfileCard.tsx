'use client'

import TrustBadge from './TrustBadge'

interface UserProfileCardProps {
    user: {
        id: string
        full_name: string
        avatar_url?: string
        trust_score: number
        trust_tier?: string
        user_type: string
        total_earnings?: number
        completed_quests?: number
    }
    showDetails?: boolean
}

export default function UserProfileCard({ user, showDetails = true }: UserProfileCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    {/* 아바타 */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-600 shadow-md">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                    {user.full_name.charAt(0)}
                                </div>
                            )}
                        </div>
                        {/* 온라인 상태 표시 (예시) */}
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>

                    {/* 이름 및 신뢰도 */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {user.full_name}
                            </h3>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 font-medium">
                                {user.user_type === 'admin' ? '관리자' : user.user_type === 'performer' ? '수행자' : '의뢰자'}
                            </span>
                        </div>

                        {/* ✨ 신뢰도 뱃지 위치 ✨ */}
                        <TrustBadge score={user.trust_score} size="sm" />
                    </div>
                </div>

                {/* 간단 통계 */}
                <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">완료한 퀘스트</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {user.completed_quests || 0}건
                    </div>
                </div>
            </div>

            {/* 상세 정보 (옵션) */}
            {showDetails && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">신뢰도 점수</div>
                        <div className="font-bold text-gray-900 dark:text-white">{user.trust_score}점</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">등급</div>
                        <div className="font-bold text-purple-600 dark:text-purple-400">{user.trust_tier || 'Newbie'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">가입일</div>
                        <div className="font-bold text-gray-900 dark:text-white">2024.12.01</div>
                    </div>
                </div>
            )}
        </div>
    )
}
