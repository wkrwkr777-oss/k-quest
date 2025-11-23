"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { filterChatMessage, getWarningMessage, SAFE_MESSAGE_TEMPLATES } from '@/lib/chatFilter';
import { createNotification } from '@/lib/notifications';
import { Send, AlertCircle, Shield, Info } from 'lucide-react';
import { Button } from './ui/Button';

interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    filtered_message: string | null;
    is_flagged: boolean;
    flagged_reason: string | null;
    created_at: string;
    sender_name?: string;
}

interface QuestChatProps {
    questId: string;
    currentUserId: string;
    otherUserId: string;
    otherUserName: string;
    onClose?: () => void;
}

export function QuestChat({
    questId,
    currentUserId,
    otherUserId,
    otherUserName,
    onClose,
}: QuestChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [warning, setWarning] = useState<string | null>(null);
    const [showTemplates, setShowTemplates] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [warningCount, setWarningCount] = useState(0);

    // 메시지 로드
    useEffect(() => {
        loadMessages();

        // 실시간 구독
        const channel = supabase
            .channel(`chat_${questId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `quest_id=eq.${questId}`,
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    if (newMsg.sender_id !== currentUserId) {
                        setMessages((prev) => [...prev, newMsg]);
                        scrollToBottom();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [questId, currentUserId]);

    // 자동 스크롤
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('quest_id', questId)
                .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        // 메시지 필터링
        const filterResult = filterChatMessage(newMessage);

        // 위반 검사
        if (filterResult.isViolation && filterResult.severity !== 'low') {
            const warningMsg = getWarningMessage(
                filterResult.severity || 'medium',
                filterResult.violationType || 'unknown'
            );
            setWarning(warningMsg);

            // 경고 횟수 증가
            const newWarningCount = warningCount + 1;
            setWarningCount(newWarningCount);

            // 위반 기록 저장
            await recordViolation(filterResult);

            // 심각한 위반일 경우 메시지 전송 차단
            if (filterResult.severity === 'critical' || filterResult.severity === 'high') {
                return;
            }
        }

        setIsLoading(true);
        setWarning(null);

        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .insert({
                    quest_id: questId,
                    sender_id: currentUserId,
                    receiver_id: otherUserId,
                    message: newMessage,
                    filtered_message: filterResult.filtered,
                    is_flagged: filterResult.isViolation,
                    flagged_reason: filterResult.violationType,
                })
                .select()
                .single();

            if (error) throw error;

            setMessages((prev) => [...prev, data]);
            setNewMessage('');

            // 상대방에게 알림
            await createNotification(
                otherUserId,
                'new_message',
                '새 메시지',
                `${currentUserId}님으로부터 새 메시지가 도착했습니다.`,
                `/quests/${questId}/chat`
            );
        } catch (error) {
            console.error('Failed to send message:', error);
            setWarning('메시지 전송에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const recordViolation = async (filterResult: any) => {
        try {
            await supabase.from('chat_violations').insert({
                user_id: currentUserId,
                violation_type: filterResult.violationType,
                matched_pattern: filterResult.matchedPattern,
                severity: filterResult.severity,
            });

            // 사용자 경고 횟수 업데이트
            await supabase
                .from('profiles')
                .update({ warning_count: warningCount + 1 })
                .eq('id', currentUserId);

            // 3회 이상 경고 시 관리자에게 알림
            if (warningCount >= 2) {
                // 관리자 찾기
                const { data: admins } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('user_type', 'admin');

                if (admins) {
                    for (const admin of admins) {
                        await createNotification(
                            admin.id,
                            'warning',
                            '사용자 경고 누적',
                            `사용자 ${currentUserId}의 경고가 ${warningCount + 1}회 누적되었습니다.`,
                            `/admin/users/${currentUserId}`
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Failed to record violation:', error);
        }
    };

    const useTemplate = (template: string) => {
        setNewMessage(template);
        setShowTemplates(false);
    };

    return (
        <div className="flex flex-col h-[600px] bg-[#1A1A1A] border border-[#333]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#111]">
                <div>
                    <h3 className="text-white font-semibold">{otherUserName}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-green-500" />
                        안전한 거래를 위해 채팅이 모니터링됩니다
                    </p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Warning Banner */}
            {warning && (
                <div className="bg-red-900/20 border-l-4 border-red-500 p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 text-sm">{warning}</p>
                        <p className="text-xs text-red-300 mt-1">
                            경고 누적: {warningCount}회 (3회 이상 시 계정 제한)
                        </p>
                    </div>
                </div>
            )}

            {/* Info Banner */}
            <div className="bg-blue-900/10 border-l-4 border-blue-500 p-2 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-300 text-xs">
                    Quest 관련 내용만 대화해주세요. 연락처, 계좌번호 공유 및 직거래는 금지되며, 위반 시 계정이 정지됩니다.
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                    const isMine = msg.sender_id === currentUserId;
                    const displayMessage = msg.filtered_message || msg.message;

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg p-3 ${isMine
                                        ? 'bg-[#D4AF37] text-black'
                                        : 'bg-[#262626] text-white'
                                    } ${msg.is_flagged ? 'border-2 border-red-500' : ''}`}
                            >
                                <p className="text-sm break-words">{displayMessage}</p>
                                {msg.is_flagged && (
                                    <p className="text-xs mt-1 opacity-70 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        의심스러운 메시지
                                    </p>
                                )}
                                <p className="text-xs mt-1 opacity-60">
                                    {new Date(msg.created_at).toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Template Suggestions */}
            {showTemplates && (
                <div className="border-t border-[#333] p-3 bg-[#111]">
                    <p className="text-xs text-gray-400 mb-2">안전한 메시지 템플릿:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {SAFE_MESSAGE_TEMPLATES.ko.slice(0, 4).map((template, idx) => (
                            <button
                                key={idx}
                                onClick={() => useTemplate(template)}
                                className="text-xs text-left p-2 bg-[#262626] hover:bg-[#333] text-gray-300 rounded transition-colors"
                            >
                                {template}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-[#333] bg-[#111]">
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="px-3 py-2 bg-[#262626] hover:bg-[#333] text-gray-300 rounded transition-colors text-sm"
                        title="안전한 메시지 템플릿"
                    >
                        📝
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Quest 관련 메시지만 입력하세요..."
                        className="flex-1 bg-[#262626] border border-[#333] text-white px-4 py-2 rounded focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-600"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={isLoading || !newMessage.trim()}
                        variant="primary"
                        className="px-4"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
