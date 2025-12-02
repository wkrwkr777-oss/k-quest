'use client'

import { REVENUE_SPLIT, formatCurrency } from '@/lib/revenueSplit'

interface RevenueSplitDisplayProps {
    amount: number
    currency?: string
    showDetails?: boolean
}

/**
 * 수익 분배 정보를 시각적으로 표시하는 컴포넌트
 */
export default function RevenueSplitDisplay({
    amount,
    currency = 'USD',
    showDetails = true,
}: RevenueSplitDisplayProps) {
    const split = REVENUE_SPLIT.splitRevenue(amount)

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-purple-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    💰 수익 분배
                </h3>
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                    {split.splitRatio}
                </span>
            </div>

            {/* 총 금액 */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">총 결제 금액</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(split.totalAmount, currency)}
                </div>
            </div>

            {/* 분배 내역 */}
            {showDetails && (
                <div className="space-y-3">
                    {/* 수행자 수익 */}
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xl">
                                👤
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">수행자 수익</div>
                                <div className="text-sm text-green-600 dark:text-green-400">
                                    {split.performerPercentage} 지급
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(split.performerEarning, currency)}
                            </div>
                        </div>
                    </div>

                    {/* 플랫폼 수수료 */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl">
                                🏢
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">플랫폼 수수료</div>
                                <div className="text-sm text-blue-600 dark:text-blue-400">
                                    {split.platformPercentage} 차감
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(split.platformFee, currency)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 설명 */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-blue-500">ℹ️</span>
                    <p>
                        K-Quest는 투명한 수익 분배 시스템을 운영합니다.
                        Quest 완료 시 수행자에게 <strong className="text-green-600 dark:text-green-400">70%</strong>가 즉시 지급되며,
                        플랫폼 운영, 에스크로, 보안 등에 <strong className="text-blue-600 dark:text-blue-400">30%</strong>가 사용됩니다.
                    </p>
                </div>
            </div>
        </div>
    )
}

/**
 * 간단한 수익 분배 요약 (작은 버전)
 */
export function RevenueSplitSummary({ amount, currency = 'USD' }: RevenueSplitDisplayProps) {
    const split = REVENUE_SPLIT.splitRevenue(amount)

    return (
        <div className="inline-flex items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm">
            <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">👤 수행자:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(split.performerEarning, currency)}
                </span>
                <span className="text-xs text-gray-500">({split.performerPercentage})</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">🏢 수수료:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(split.platformFee, currency)}
                </span>
                <span className="text-xs text-gray-500">({split.platformPercentage})</span>
            </div>
        </div>
    )
}

/**
 * 수익 분배 프로그레스 바
 */
export function RevenueSplitProgress({ amount }: { amount: number }) {
    const split = REVENUE_SPLIT.splitRevenue(amount)

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span>수익 분배</span>
                <span>{split.splitRatio}</span>
            </div>
            <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: '70%' }}
                >
                    수행자 70%
                </div>
                <div
                    className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: '30%' }}
                >
                    플랫폼 30%
                </div>
            </div>
        </div>
    )
}
