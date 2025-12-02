'use client'

import { useState } from 'react'

export default function ReferralCard({ userId }: { userId: string }) {
    const [copied, setCopied] = useState(false)

    // 실제 도메인이 없으므로 localhost 또는 배포 주소 사용
    const referralLink = `https://k-quest.com/join?ref=${userId}`

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'K-Quest 초대장',
                    text: 'K-Quest에 가입하고 5,000원 쿠폰 받으세요!',
                    url: referralLink,
                })
            } catch (err) {
                console.log('Share canceled')
            }
        } else {
            handleCopy()
        }
    }

    return (
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute right-[-20px] top-[-20px] text-9xl opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-500">
                💌
            </div>

            <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    💌 친구 초대하고 쿠폰 받기
                </h3>
                <p className="text-pink-100 text-sm mb-4">
                    친구가 내 링크로 가입하면 두 분 모두에게<br />
                    <span className="font-bold text-white bg-white/20 px-1 rounded">5,000원 할인 쿠폰</span>을 드립니다!
                </p>

                <div className="flex gap-2">
                    <div className="flex-1 bg-black/20 rounded-lg px-3 py-2 text-sm font-mono truncate flex items-center text-pink-100">
                        {referralLink}
                    </div>
                    <button
                        onClick={handleShare}
                        className="bg-white text-pink-600 px-4 py-2 rounded-lg font-bold hover:bg-pink-50 transition-colors shadow-md flex items-center gap-1"
                    >
                        {copied ? '✅ 복사됨' : '📤 공유'}
                    </button>
                </div>
            </div>
        </div>
    )
}
