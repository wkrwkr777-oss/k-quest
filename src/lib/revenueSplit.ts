/**
 * K-Quest 수익 분배 설정
 * 플랫폼 전체에서 사용되는 수익 분배 비율을 중앙에서 관리
 */

export const REVENUE_SPLIT = {
    // 기본 수익 분배 비율
    PERFORMER_RATE: 0.70,      // 수행자: 70%
    PLATFORM_RATE: 0.30,       // 플랫폼: 30%

    // 퍼센트 표기
    PERFORMER_PERCENTAGE: '70%',
    PLATFORM_PERCENTAGE: '30%',
    SPLIT_RATIO: '70:30',

    // 계산 함수
    calculatePerformerEarning: (amount: number): number => {
        return amount * REVENUE_SPLIT.PERFORMER_RATE
    },

    calculatePlatformFee: (amount: number): number => {
        return amount * REVENUE_SPLIT.PLATFORM_RATE
    },

    // 전체 분해
    splitRevenue: (amount: number) => {
        const performerEarning = amount * REVENUE_SPLIT.PERFORMER_RATE
        const platformFee = amount * REVENUE_SPLIT.PLATFORM_RATE

        return {
            totalAmount: amount,
            performerEarning,
            platformFee,
            performerRate: REVENUE_SPLIT.PERFORMER_RATE,
            platformRate: REVENUE_SPLIT.PLATFORM_RATE,
            performerPercentage: REVENUE_SPLIT.PERFORMER_PERCENTAGE,
            platformPercentage: REVENUE_SPLIT.PLATFORM_PERCENTAGE,
            splitRatio: REVENUE_SPLIT.SPLIT_RATIO,
        }
    },

    // 검증 함수
    validateAmount: (amount: number): boolean => {
        return amount > 0 && Number.isFinite(amount)
    },

    // 최소 거래 금액 (예: $10)
    MINIMUM_TRANSACTION_AMOUNT: 10,

    // 수익 분배 정보 (UI 표시용)
    getDisplayInfo: () => ({
        title: 'K-Quest 수익 분배 시스템',
        description: '투명하고 공정한 수익 분배',
        breakdown: [
            {
                recipient: '수행자',
                percentage: REVENUE_SPLIT.PERFORMER_PERCENTAGE,
                rate: REVENUE_SPLIT.PERFORMER_RATE,
                description: 'Quest를 성공적으로 수행한 수행자에게 지급',
                icon: '👤',
            },
            {
                recipient: '플랫폼',
                percentage: REVENUE_SPLIT.PLATFORM_PERCENTAGE,
                rate: REVENUE_SPLIT.PLATFORM_RATE,
                description: '플랫폼 운영, 에스크로, 보안, 고객지원 등',
                icon: '🏢',
            },
        ],
        features: [
            '✅ 자동 에스크로 시스템',
            '✅ Quest 완료 시 즉시 정산',
            '✅ 투명한 거래 내역',
            '✅ 안전한 결제 처리',
        ],
    }),
}

// 타입 정의
export interface RevenueSplit {
    totalAmount: number
    performerEarning: number
    platformFee: number
    performerRate: number
    platformRate: number
    performerPercentage: string
    platformPercentage: string
    splitRatio: string
}

export interface TransactionBreakdown {
    questId?: string
    amount: number
    currency: string
    breakdown: RevenueSplit
    paymentMethod: 'stripe' | 'paypal'
    status: 'pending' | 'completed' | 'failed' | 'refunded'
}

// Helper 함수들
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: currency,
    }).format(amount)
}

export const createTransactionBreakdown = (
    amount: number,
    questId?: string,
    paymentMethod: 'stripe' | 'paypal' = 'stripe'
): TransactionBreakdown => {
    return {
        questId,
        amount,
        currency: 'USD',
        breakdown: REVENUE_SPLIT.splitRevenue(amount),
        paymentMethod,
        status: 'pending',
    }
}

// 환경별 설정 (추후 확장용)
export const REVENUE_CONFIG = {
    production: {
        ...REVENUE_SPLIT,
        MINIMUM_TRANSACTION_AMOUNT: 10,
    },
    development: {
        ...REVENUE_SPLIT,
        MINIMUM_TRANSACTION_AMOUNT: 1, // 테스트용 낮은 금액
    },
}

// 현재 환경에 맞는 설정 export
export const currentRevenueConfig =
    process.env.NODE_ENV === 'production'
        ? REVENUE_CONFIG.production
        : REVENUE_CONFIG.development

export default REVENUE_SPLIT
