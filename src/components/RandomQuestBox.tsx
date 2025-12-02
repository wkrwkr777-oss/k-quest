'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase' // 클라이언트용 supabase

export default function RandomQuestBox({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [canOpen, setCanOpen] = useState(false)
    const [reward, setReward] = useState<{ type: string, value: number } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkDailyStatus()
    }, [userId])

    const checkDailyStatus = async () => {
        const today = new Date().toISOString().split('T')[0]

        // 오늘 이미 열었는지 확인
        const { data } = await supabase
            .from('daily_checkins')
            .select('*')
            .eq('user_id', userId)
            .eq('checkin_date', today)
            .single()

        if (!data) {
            setCanOpen(true)
        }
        setLoading(false)
    }

    const handleOpenBox = async () => {
        if (!canOpen || loading) return

        setLoading(true)

        // 랜덤 보상 로직 (클라이언트에서 보여주기용, 실제 지급은 서버 API로 하는게 안전하지만 여기선 시뮬레이션)
        // 확률: 100P(60%), 500P(30%), 1000P(9%), 50%할인쿠폰(1%)
        const rand = Math.random() * 100
        let type = 'point'
        let value = 100

        if (rand > 99) { type = 'coupon'; value = 50; } // 50% 할인
        else if (rand > 90) { value = 1000; }
        else if (rand > 60) { value = 500; }

        try {
            // API 호출하여 보상 지급 (구현 필요)
            // await fetch('/api/gamification/daily-checkin', ...)

            // DB에 기록 (임시)
            const today = new Date().toISOString().split('T')[0]
            await supabase.from('daily_checkins').insert({
                user_id: userId,
                checkin_date: today,
                reward_type: type,
                reward_value: value
            })

            setReward({ type, value })
            setIsOpen(true)
            setCanOpen(false)
        } catch (error) {
            console.error('Error opening box:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return null // 로딩 중엔 숨김

    if (!canOpen && !isOpen) return null // 이미 열었으면 숨김 (또는 '내일 다시 오세요' 표시)

    return (
        <div className="fixed bottom-24 left-4 z-50">
            {!isOpen ? (
                <button
                    onClick={handleOpenBox}
                    className="group relative w-16 h-16 transition-transform hover:scale-110 active:scale-95"
                >
                    <div className="absolute inset-0 bg-yellow-400 rounded-xl rotate-3 group-hover:rotate-6 transition-transform shadow-lg"></div>
                    <div className="absolute inset-0 bg-yellow-500 rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform shadow-lg flex items-center justify-center border-2 border-yellow-200">
                        <span className="text-3xl animate-bounce">🎁</span>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        OPEN
                    </div>
                </button>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl border-2 border-yellow-400 animate-in zoom-in duration-300 text-center min-w-[200px]">
                    <div className="text-4xl mb-2">
                        {reward?.type === 'coupon' ? '🎫' : '💰'}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        축하합니다!
                    </h3>
                    <p className="text-purple-600 font-bold text-xl my-1">
                        {reward?.type === 'coupon'
                            ? `${reward.value}% 할인 쿠폰`
                            : `${reward?.value} 포인트`}
                    </p>
                    <p className="text-xs text-gray-500">
                        내일 또 방문해주세요!
                    </p>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="mt-3 text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                        닫기
                    </button>
                </div>
            )}
        </div>
    )
}
