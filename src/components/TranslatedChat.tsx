'use client'

import { useState, useEffect } from 'react'
import { useTranslator } from '@/hooks/useTranslator'
import { checkMessageSafety } from '@/lib/antiCircumvention'

interface Message {
    id: string
    text: string
    sender: 'me' | 'other'
    lang: string // 'ko', 'en', etc.
}

export default function TranslatedChat() {
    const { isReady, progress, translate } = useTranslator()
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello! Can you help me find a good restaurant?', sender: 'other', lang: 'en' },
        { id: '2', text: 'Of course! What kind of food do you like?', sender: 'me', lang: 'en' },
    ])
    const [inputText, setInputText] = useState('')
    const [myLang, setMyLang] = useState('ko') // 내 언어 (한국어)
    const [targetLang, setTargetLang] = useState('en') // 상대방 언어 (영어)

    // 번역된 텍스트 캐시
    const [translations, setTranslations] = useState<{ [key: string]: string }>({})

    // 메시지 자동 번역
    useEffect(() => {
        if (!isReady) return

        messages.forEach(async (msg) => {
            // 이미 번역했거나, 내 언어와 같으면 패스
            if (translations[msg.id] || msg.lang === myLang) return

            try {
                const translated = await translate(msg.text, msg.lang, myLang)
                setTranslations(prev => ({ ...prev, [msg.id]: translated }))
            } catch (error) {
                console.error('Translation failed:', error)
            }
        })
    }, [messages, isReady, myLang])

    const handleSend = async () => {
        if (!inputText.trim()) return

        // 🛡️ 직거래 방지 필터 체크
        const safetyCheck = checkMessageSafety(inputText)

        if (!safetyCheck.isClean) {
            // 경고 메시지 표시
            alert(`${safetyCheck.warningMessage}\n\nK-Quest 플랫폼 외부에서의 거래는 사기 위험이 있으며, 적발 시 계정이 영구 정지될 수 있습니다.`)

            // 위험한 내용(전화번호, 계좌 등)이 감지되면 전송 중단
            if (safetyCheck.detectedType !== 'keyword') {
                return
            }
            // 단순 키워드는 경고 후 전송 허용 (하지만 로그는 남겨야 함 - 추후 구현)
        }

        // 1. 내 화면에 먼저 표시
        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'me',
            lang: myLang,
        }
        setMessages(prev => [...prev, newMessage])
        setInputText('')

        // 2. (실제로는 여기서 상대방에게 전송)
        // 상대방에게는 inputText 그대로 전송하고, 상대방 클라이언트에서 번역됨
    }

    return (
        <div className="flex flex-col h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                    🌐 AI 실시간 번역 채팅
                </h3>
                <div className="flex items-center gap-2 text-xs">
                    {!isReady ? (
                        <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
                            <span className="animate-spin">⏳</span> AI 모델 로딩중... {Math.round(progress)}%
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded border border-green-400/50">
                            ✅ AI Ready
                        </span>
                    )}
                </div>
            </div>

            {/* Language Settings */}
            <div className="bg-gray-50 dark:bg-gray-900 p-2 flex justify-between text-sm border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">내 언어:</span>
                    <select
                        value={myLang}
                        onChange={(e) => setMyLang(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                    >
                        <option value="ko">한국어 🇰🇷</option>
                        <option value="en">English 🇺🇸</option>
                        <option value="ja">日本語 🇯🇵</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">상대방:</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                        {targetLang === 'en' ? 'English 🇺🇸' : targetLang}
                    </span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900/50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === 'me'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                                }`}
                        >
                            {/* 원문 */}
                            <div className="text-sm">{msg.text}</div>

                            {/* 번역문 (상대방 메시지인 경우) */}
                            {msg.sender === 'other' && (
                                <div className="mt-2 pt-2 border-t border-gray-200/20 text-xs text-indigo-200 dark:text-indigo-300 flex items-center gap-1">
                                    <span>🌐</span>
                                    {translations[msg.id] ? (
                                        <span className="font-medium text-indigo-100 dark:text-indigo-200">
                                            {translations[msg.id]}
                                        </span>
                                    ) : (
                                        <span className="animate-pulse">번역 중...</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-1">
                            {msg.lang === 'ko' ? '🇰🇷' : '🇺🇸'} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isReady ? "메시지를 입력하세요..." : "AI 모델을 다운로드 중입니다..."}
                        disabled={!isReady}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!isReady || !inputText.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-bold transition-colors disabled:opacity-50 shadow-md"
                    >
                        전송
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-gray-400">
                        ⚡ Powered by On-Device AI (Free & Private) • 🛡️ 직거래 유도 시 제재될 수 있습니다
                    </span>
                </div>
            </div>
        </div>
    )
}
