'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

interface ViralQuestPosterProps {
    questTitle: string
    reward: number
    category: string
    userName: string
}

export default function ViralQuestPoster({ questTitle, reward, category, userName }: ViralQuestPosterProps) {
    const posterRef = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const handleShare = async () => {
        if (!posterRef.current) return
        setIsGenerating(true)

        try {
            // HTML을 이미지로 변환 (무료)
            const canvas = await html2canvas(posterRef.current, {
                scale: 2, // 고화질
                backgroundColor: null,
                useCORS: true
            })

            canvas.toBlob(async (blob) => {
                if (!blob) return

                // 모바일 네이티브 공유 (인스타, 트위터 등으로 바로 연결)
                if (navigator.share) {
                    const file = new File([blob], 'k-quest-mission.png', { type: 'image/png' })
                    await navigator.share({
                        title: 'My Secret Mission in Korea',
                        text: `I'm hiring a local agent in Korea for this mission! #KQuest #Korea`,
                        files: [file]
                    })
                } else {
                    // PC에서는 다운로드
                    const link = document.createElement('a')
                    link.download = 'k-quest-mission.png'
                    link.href = canvas.toDataURL()
                    link.click()
                    alert('이미지가 저장되었습니다! SNS에 자랑해보세요.')
                }
            })
        } catch (err) {
            console.error('Poster generation failed', err)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 my-8">
            {/* 📸 포스터 영역 (실제로는 화면 밖이나 숨겨놓을 수도 있지만, 미리보기로 보여줌) */}
            <div
                ref={posterRef}
                className="relative w-[320px] h-[400px] bg-black overflow-hidden rounded-xl shadow-2xl flex flex-col"
            >
                {/* 배경 효과 (Cyberpunk Style) */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900 opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>

                {/* 네온 장식 */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 shadow-[0_0_20px_rgba(236,72,153,0.8)]"></div>

                {/* 컨텐츠 */}
                <div className="relative z-10 p-6 flex flex-col h-full justify-between text-center font-sans">
                    <div>
                        <div className="inline-block border-2 border-red-500 text-red-500 px-3 py-1 text-xs font-bold tracking-[0.2em] mb-4 animate-pulse">
                            MISSION: ACTIVE
                        </div>
                        <h2 className="text-3xl font-black text-white italic leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] mb-2">
                            {category.toUpperCase()}
                        </h2>
                        <p className="text-gray-300 text-sm font-mono mb-6 line-clamp-3">
                            "{questTitle}"
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">BOUNTY REWARD</p>
                            <p className="text-3xl font-black text-yellow-400 drop-shadow-md">
                                ₩{reward.toLocaleString()}
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-cyan-400 overflow-hidden">
                                {/* 아바타 플레이스홀더 */}
                                <div className="w-full h-full bg-gradient-to-tr from-cyan-500 to-blue-500"></div>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-gray-400">AGENT HANDLER</p>
                                <p className="text-sm font-bold text-white">{userName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-[10px] text-gray-600 font-mono tracking-widest">
                        SECURED BY K-QUEST PROTOCOL
                    </div>
                </div>
            </div>

            {/* 버튼 */}
            <button
                onClick={handleShare}
                disabled={isGenerating}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
                {isGenerating ? 'Generating...' : '🚀 Share Mission to Instagram'}
            </button>
            <p className="text-xs text-gray-500 text-center max-w-xs">
                * Share this poster to recruit agents 3x faster!
            </p>
        </div>
    )
}
