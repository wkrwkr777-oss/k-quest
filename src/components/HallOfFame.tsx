'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import UserProfileCard from './UserProfileCard'

export default function HallOfFame() {
    const [topPerformers, setTopPerformers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRankings()
    }, [])

    const fetchRankings = async () => {
        // 신뢰도 점수 높은 순으로 상위 3명 조회
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_type', 'performer')
            .order('trust_score', { ascending: false })
            .limit(3)

        if (data) {
            setTopPerformers(data)
        }
        setLoading(false)
    }

    if (loading) return <div className="animate-pulse h-40 bg-gray-100 rounded-xl"></div>

    return (
        <div className="bg-gradient-to-b from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
            {/* 배경 장식 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            </div>

            <div className="relative z-10 text-center mb-8">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 drop-shadow-lg flex items-center justify-center gap-2">
                    🏆 HALL OF FAME 🏆
                </h2>
                <p className="text-purple-200 text-sm">
                    이번 주 최고의 K-Quest 수행자들입니다
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-end">
                {/* 2등 */}
                <div className="order-2 md:order-1 transform translate-y-4">
                    <div className="text-center mb-2 text-2xl">🥈</div>
                    <UserProfileCard user={topPerformers[1]} showDetails={false} />
                </div>

                {/* 1등 */}
                <div className="order-1 md:order-2 transform -translate-y-4 scale-110 z-20">
                    <div className="text-center mb-2 text-4xl animate-bounce">👑</div>
                    <div className="ring-4 ring-yellow-400 rounded-xl shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                        <UserProfileCard user={topPerformers[0]} showDetails={true} />
                    </div>
                </div>

                {/* 3등 */}
                <div className="order-3 md:order-3 transform translate-y-4">
                    <div className="text-center mb-2 text-2xl">🥉</div>
                    <UserProfileCard user={topPerformers[2]} showDetails={false} />
                </div>
            </div>
        </div>
    )
}
