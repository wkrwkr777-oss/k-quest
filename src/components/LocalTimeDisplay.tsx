'use client'

import { useState, useEffect } from 'react'

interface LocalTimeDisplayProps {
    timezone?: string // 예: 'Asia/Seoul', 'America/New_York'
    label?: string
}

export default function LocalTimeDisplay({ timezone = 'Asia/Seoul', label = '한국 시간' }: LocalTimeDisplayProps) {
    const [timeString, setTimeString] = useState('')
    const [isDaytime, setIsDaytime] = useState(true)

    useEffect(() => {
        const updateTime = () => {
            try {
                const now = new Date()

                // 시간 포맷팅
                const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
                    timeZone: timezone,
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })

                // 낮/밤 판별 (오전 6시 ~ 오후 6시를 낮으로 가정)
                const hourFormatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: timezone,
                    hour: 'numeric',
                    hour12: false
                })
                const currentHour = parseInt(hourFormatter.format(now))
                setIsDaytime(currentHour >= 6 && currentHour < 18)

                setTimeString(timeFormatter.format(now))
            } catch (error) {
                setTimeString('시간 정보 없음')
            }
        }

        updateTime()
        const timer = setInterval(updateTime, 60000) // 1분마다 갱신

        return () => clearInterval(timer)
    }, [timezone])

    return (
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full w-fit">
            <span className="text-lg" role="img" aria-label="time-icon">
                {isDaytime ? '☀️' : '🌙'}
            </span>
            <div className="flex flex-col leading-none">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                    {label}
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {timeString}
                </span>
            </div>
        </div>
    )
}
