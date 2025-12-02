'use client'

import { useMemo } from 'react'

interface TrustBadgeProps {
    score: number // 0 ~ 100
    size?: 'sm' | 'md' | 'lg' | 'xl'
    showLabel?: boolean
    showScore?: boolean
    animate?: boolean
}

export default function TrustBadge({
    score,
    size = 'md',
    showLabel = true,
    showScore = true,
    animate = true,
}: TrustBadgeProps) {
    // 티어 계산 및 스타일 정의
    const tier = useMemo(() => {
        if (score >= 95) return {
            name: 'DIAMOND',
            color: 'from-cyan-400 via-blue-500 to-purple-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-700',
            text: 'text-blue-700 dark:text-blue-300',
            icon: '💎',
            glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
            effect: 'animate-pulse'
        }
        if (score >= 90) return {
            name: 'PLATINUM',
            color: 'from-slate-300 via-gray-400 to-slate-500',
            bg: 'bg-slate-50 dark:bg-slate-900/20',
            border: 'border-slate-200 dark:border-slate-700',
            text: 'text-slate-700 dark:text-slate-300',
            icon: '💠',
            glow: 'shadow-[0_0_10px_rgba(148,163,184,0.5)]',
            effect: ''
        }
        if (score >= 80) return {
            name: 'GOLD',
            color: 'from-yellow-300 via-amber-400 to-yellow-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-200 dark:border-amber-700',
            text: 'text-amber-700 dark:text-amber-300',
            icon: '👑',
            glow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]',
            effect: ''
        }
        if (score >= 70) return {
            name: 'SILVER',
            color: 'from-gray-300 via-gray-400 to-gray-500',
            bg: 'bg-gray-50 dark:bg-gray-900/20',
            border: 'border-gray-200 dark:border-gray-700',
            text: 'text-gray-700 dark:text-gray-300',
            icon: '🥈',
            glow: '',
            effect: ''
        }
        if (score >= 50) return {
            name: 'BRONZE',
            color: 'from-orange-300 via-orange-400 to-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            border: 'border-orange-200 dark:border-orange-700',
            text: 'text-orange-800 dark:text-orange-200',
            icon: '🥉',
            glow: '',
            effect: ''
        }
        if (score >= 30) return {
            name: 'WARNING',
            color: 'from-red-400 via-red-500 to-red-600',
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-700',
            text: 'text-red-700 dark:text-red-300',
            icon: '⚠️',
            glow: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
            effect: 'animate-pulse'
        }
        return {
            name: 'BLACKLIST',
            color: 'from-gray-800 via-black to-gray-900',
            bg: 'bg-gray-100 dark:bg-gray-800',
            border: 'border-gray-400 dark:border-gray-600',
            text: 'text-gray-600 dark:text-gray-400',
            icon: '🚫',
            glow: '',
            effect: 'grayscale'
        }
    }, [score])

    // 사이즈 설정
    const sizeClasses = {
        sm: 'text-xs px-1.5 py-0.5 gap-1',
        md: 'text-sm px-2.5 py-1 gap-1.5',
        lg: 'text-base px-3 py-1.5 gap-2',
        xl: 'text-lg px-4 py-2 gap-2.5',
    }

    const iconSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-lg',
        xl: 'text-xl',
    }

    return (
        <div className={`inline-flex items-center rounded-full border ${tier.bg} ${tier.border} ${sizeClasses[size]} ${animate && tier.glow} transition-all duration-300 hover:scale-105 select-none`}>
            {/* 아이콘 */}
            <span className={`${iconSizes[size]} ${animate && tier.effect}`}>
                {tier.icon}
            </span>

            {/* 라벨 (티어 이름) */}
            {showLabel && (
                <span className={`font-black tracking-wider bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    {tier.name}
                </span>
            )}

            {/* 점수 (%) */}
            {showScore && (
                <div className="flex items-center gap-1 ml-1 pl-2 border-l border-gray-300 dark:border-gray-600">
                    <span className={`font-bold font-mono ${tier.text}`}>
                        {score}%
                    </span>
                </div>
            )}
        </div>
    )
}
