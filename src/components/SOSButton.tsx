'use client'

import { useState, useEffect } from 'react'

export default function SOSButton() {
    const [locationLink, setLocationLink] = useState('')
    const [isEmergency, setIsEmergency] = useState(false)

    useEffect(() => {
        // 미리 위치 정보를 확보해둠 (위급 시 딜레이 방지)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords
                    // 구글 맵 링크 생성
                    setLocationLink(`https://www.google.com/maps?q=${latitude},${longitude}`)
                },
                (err) => console.error('Location access denied', err),
                { enableHighAccuracy: true }
            )
        }
    }, [])

    const handleSOS = () => {
        if (!confirm('🚨 정말로 SOS 요청을 보내시겠습니까?\n(문자 메시지 앱이 실행됩니다)')) return

        const message = `[K-Quest 긴급요청] 도와주세요! 현재 위험한 상황입니다.\n내 위치: ${locationLink || '위치 정보 없음'}`
        const encodedMessage = encodeURIComponent(message)

        // SMS 링크 실행 (모바일에서 문자 앱 열림)
        window.location.href = `sms:?body=${encodedMessage}`

        setIsEmergency(true)
        setTimeout(() => setIsEmergency(false), 5000)
    }

    return (
        <div className="fixed bottom-24 right-4 z-50">
            <button
                onClick={handleSOS}
                className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl border-4 border-white transition-all duration-300 transform hover:scale-110 active:scale-95 ${isEmergency
                        ? 'bg-red-600 animate-ping'
                        : 'bg-red-500 hover:bg-red-600 animate-pulse'
                    }`}
                title="긴급 호출 (SOS)"
            >
                <span className="text-2xl">🚨</span>
            </button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                SOS 안심버튼
            </div>
        </div>
    )
}
