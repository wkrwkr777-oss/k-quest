'use client'

import { useState, useEffect } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import { BlacklistManager } from '@/components/admin/BlacklistManager'

interface DashboardStats {
    todayRevenue: number
    monthlyRevenue: number
    totalUsers: number
    activeQuests: number
    pendingDisputes: number
    newUsersToday: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        todayRevenue: 0,
        monthlyRevenue: 0,
        totalUsers: 0,
        activeQuests: 0,
        pendingDisputes: 0,
        newUsersToday: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const today = new Date().toISOString().split('T')[0]
            const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

            // 오늘 매출
            const { data: todayTransactions } = await supabaseAdmin
                .from('transactions')
                .select('platform_fee')
                .gte('created_at', today)
                .eq('status', 'completed')

            const todayRevenue = todayTransactions?.reduce((sum, t) => sum + (t.platform_fee || 0), 0) || 0

            // 이번 달 매출
            const { data: monthTransactions } = await supabaseAdmin
                .from('transactions')
                .select('platform_fee')
                .gte('created_at', monthStart)
                .eq('status', 'completed')

            const monthlyRevenue = monthTransactions?.reduce((sum, t) => sum + (t.platform_fee || 0), 0) || 0

            // 총 사용자 수
            const { count: totalUsers } = await supabaseAdmin
                .from('profiles')
                .select('*', { count: 'exact', head: true })

            // 진행 중인 퀘스트
            const { count: activeQuests } = await supabaseAdmin
                .from('quests')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'in_progress')

            // 미해결 분쟁
            const { count: pendingDisputes } = await supabaseAdmin
                .from('disputes')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending')

            // 오늘 신규 가입자
            const { count: newUsersToday } = await supabaseAdmin
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today)

            setStats({
                todayRevenue,
                monthlyRevenue,
                totalUsers: totalUsers || 0,
                activeQuests: activeQuests || 0,
                pendingDisputes: pendingDisputes || 0,
                newUsersToday: newUsersToday || 0
            })
        } catch (error) {
            console.error('Dashboard stats error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="text-center p-8">로딩 중...</div>
    }

    const statCards = [
        { label: '오늘 매출', value: `₩${stats.todayRevenue.toLocaleString()}`, icon: '💰', color: 'bg-green-500' },
        { label: '이번 달 매출', value: `₩${stats.monthlyRevenue.toLocaleString()}`, icon: '📊', color: 'bg-blue-500' },
        { label: '총 사용자', value: stats.totalUsers.toLocaleString(), icon: '👥', color: 'bg-purple-500' },
        { label: '진행 중 퀘스트', value: stats.activeQuests.toLocaleString(), icon: '🎯', color: 'bg-indigo-500' },
        { label: '미처리 분쟁', value: stats.pendingDisputes.toLocaleString(), icon: '⚖️', color: 'bg-red-500' },
        { label: '오늘 신규 가입', value: stats.newUsersToday.toLocaleString(), icon: '✨', color: 'bg-yellow-500' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    📊 K-Quest 관리자 대시보드
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((card, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <div className={`${card.color} h-2`}></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-4xl">{card.icon}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{card.label}</span>
                                </div>
                                <p className="text-3xl font-black text-gray-900 dark:text-white">
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI vs Human Stats Section */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* AI Performance */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                🤖 AI 비서 만족도
                            </h2>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
                                Beta
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">평균 평점</p>
                                <p className="text-3xl font-bold text-purple-400">4.8<span className="text-sm text-gray-500">/5.0</span></p>
                            </div>
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">총 평가 수</p>
                                <p className="text-3xl font-bold text-white">1,240</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">주요 강점:</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">⚡ 즉시 응답</span>
                                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">🌙 24시간 가동</span>
                                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">💰 무료</span>
                            </div>
                        </div>
                    </div>

                    {/* Human Performance */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                🧑 인간 전문가 만족도
                            </h2>
                            <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-sm font-bold">
                                Premium
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">평균 평점</p>
                                <p className="text-3xl font-bold text-[#D4AF37]">4.9<span className="text-sm text-gray-500">/5.0</span></p>
                            </div>
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">총 평가 수</p>
                                <p className="text-3xl font-bold text-white">856</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">주요 강점:</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">💖 감성 케어</span>
                                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">🏃 현장 동행</span>
                                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">🧩 복잡한 해결</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        빠른 액션
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors">
                            분쟁 처리
                        </button>
                        <button className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors">
                            인증 승인
                        </button>
                        <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors">
                            수익 현황
                        </button>
                        <button className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors">
                            에러 로그
                        </button>
                    </div>
                </div>

                {/* 블랙리스트 관리 */}
                <div className="mt-8">
                    <BlacklistManager />
                </div>
            </div>
        </div>
    )
}
