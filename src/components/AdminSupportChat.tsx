'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface AdminChatProps {
    userId: string
    questId?: string
    isAdmin: boolean
}

interface Message {
    id: string
    message: string
    is_admin: boolean
    created_at: string
}

export default function AdminSupportChat({ userId, questId, isAdmin }: AdminChatProps) {
    const [chatId, setChatId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        initChat()
    }, [])

    useEffect(() => {
        if (chatId) {
            loadMessages()
            subscribeToMessages()
        }
    }, [chatId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const initChat = async () => {
        // 기존 채팅방 찾기 또는 새로 생성
        const { data: existingChat } = await supabase
            .from('admin_support_chats')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'open')
            .single()

        if (existingChat) {
            setChatId(existingChat.id)
        } else {
            // 새 채팅방 생성
            const { data: newChat } = await supabase
                .from('admin_support_chats')
                .insert({
                    user_id: userId,
                    quest_id: questId,
                    status: 'open'
                })
                .select()
                .single()

            if (newChat) setChatId(newChat.id)
        }
        setLoading(false)
    }

    const loadMessages = async () => {
        const { data } = await supabase
            .from('admin_support_messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true })

        if (data) setMessages(data)
    }

    const subscribeToMessages = () => {
        const subscription = supabase
            .channel(`support_chat_${chatId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'admin_support_messages',
                filter: `chat_id=eq.${chatId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message])
            })
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }

    const sendMessage = async () => {
        if (!inputText.trim() || !chatId) return

        await supabase
            .from('admin_support_messages')
            .insert({
                chat_id: chatId,
                sender_id: userId,
                is_admin: isAdmin,
                message: inputText
            })

        setInputText('')
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    if (loading) return <div className="text-center p-4">로딩 중...</div>

    return (
        <div className="flex flex-col h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🛟</span>
                    <div>
                        <h3 className="font-bold">관리자 고객지원</h3>
                        <p className="text-xs text-blue-100">빠른 답변을 드리겠습니다</p>
                    </div>
                </div>
                {isAdmin && (
                    <span className="bg-white/20 px-2 py-1 rounded text-xs">관리자 모드</span>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.is_admin
                                    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                                    : 'bg-blue-600 text-white rounded-tr-none'
                                }`}
                        >
                            {msg.is_admin && (
                                <div className="text-xs text-blue-600 font-bold mb-1">👨‍💼 관리자</div>
                            )}
                            <p className="text-sm">{msg.message}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition-colors disabled:opacity-50"
                    >
                        전송
                    </button>
                </div>
            </div>
        </div>
    )
}
