'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Leaflet 아이콘 이슈 해결
const iconPerson = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

interface LiveLocationTrackerProps {
    questId: string
    isPerformer: boolean // true면 내 위치 전송, false면 상대 위치 수신
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo(center, 15)
    }, [center, map])
    return null
}

export default function LiveLocationTracker({ questId, isPerformer }: LiveLocationTrackerProps) {
    const [position, setPosition] = useState<[number, number] | null>(null)
    const [isTracking, setIsTracking] = useState(false)

    // 위치 추적 (수행자용)
    useEffect(() => {
        if (!isPerformer || !isTracking) return

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords
                const newPos: [number, number] = [latitude, longitude]
                setPosition(newPos)

                // TODO: Supabase Realtime으로 위치 전송 로직 추가
                // supabase.channel(`quest-${questId}`).send({ type: 'location', payload: newPos })
            },
            (err) => console.error(err),
            { enableHighAccuracy: true }
        )

        return () => navigator.geolocation.clearWatch(watchId)
    }, [isPerformer, isTracking, questId])

    // 위치 수신 (의뢰자용) - 데모용으로 3초마다 위치 업데이트 시뮬레이션
    useEffect(() => {
        if (isPerformer) return

        // 서울 시청 좌표
        const startPos: [number, number] = [37.5665, 126.9780]
        setPosition(startPos)

        const interval = setInterval(() => {
            setPosition(prev => {
                if (!prev) return startPos
                // 약간씩 이동
                return [
                    prev[0] + (Math.random() - 0.5) * 0.001,
                    prev[1] + (Math.random() - 0.5) * 0.001
                ]
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [isPerformer])

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                    📍 실시간 위치 추적 (Live)
                </h3>
                {isPerformer && (
                    <button
                        onClick={() => setIsTracking(!isTracking)}
                        className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${isTracking
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                    >
                        {isTracking ? '추적 중지 ⏹️' : '위치 공유 시작 ▶️'}
                    </button>
                )}
            </div>

            <div className="h-[300px] relative z-0">
                {position ? (
                    <MapContainer
                        center={position}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position} icon={iconPerson}>
                            <Popup>
                                {isPerformer ? "나의 현재 위치" : "수행자 위치"}
                            </Popup>
                        </Marker>
                        <MapUpdater center={position} />
                    </MapContainer>
                ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-500">
                        위치 정보를 불러오는 중...
                    </div>
                )}
            </div>

            <div className="p-2 bg-gray-50 dark:bg-gray-900 text-xs text-center text-gray-500">
                OpenStreetMap을 사용하여 무료로 제공됩니다.
            </div>
        </div>
    )
}
