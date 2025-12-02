'use client';

import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { PremiumCard, PremiumButton } from '@/components/PremiumComponents';

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            content: '안녕하세요! 👋 저는 K-Quest AI 비서입니다. 한국 여행에 대해 무엇이든 물어보세요!',
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/ai-quest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            if (response.ok) {
                const aiMessage: Message = {
                    role: 'ai',
                    content: data.response,
                    timestamp: data.timestamp,
                };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                throw new Error(data.error || 'Failed to get AI response');
            }
        } catch (error: any) {
            const errorMessage: Message = {
                role: 'ai',
                content: `죄송합니다. 오류가 발생했습니다: ${error.message}`,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0A0A0A] pt-24 px-6 pb-6">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                        <h1 className="text-4xl font-bold text-white">AI 비서 (무료 베타)</h1>
                    </div>
                    <p className="text-gray-400">
                        맛집? 교통? 쇼핑? 뭐든 물어보세요! (완전 무료)
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                        💡 Powered by Google Gemini Free Tier
                    </p>
                </div>

                {/* Chat Container */}
                <PremiumCard className="h-[600px] flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                            ? 'bg-[#D4AF37]'
                                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                            }`}
                                    >
                                        {msg.role === 'user' ? (
                                            <User className="w-5 h-5 text-black" />
                                        ) : (
                                            <Bot className="w-5 h-5 text-white" />
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div
                                        className={`rounded-2xl px-4 py-3 ${msg.role === 'user'
                                            ? 'bg-[#D4AF37] text-black'
                                            : 'bg-[#1A1A1A] text-white border border-[#333]'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        <p className="text-xs opacity-50 mt-1">
                                            {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white animate-pulse" />
                                    </div>
                                    <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl px-4 py-3">
                                        <p className="text-sm text-gray-400">AI가 생각 중...</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-[#333] p-4">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="한국 여행에 대해 물어보세요..."
                                className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                                disabled={loading}
                            />
                            <PremiumButton
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="px-6"
                            >
                                <Send className="w-5 h-5" />
                            </PremiumButton>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                            💡 복잡한 질문은 한국 전문가에게 퀘스트를 의뢰하세요
                        </p>
                    </div>
                </PremiumCard>
            </div>
        </main>
    );
}
