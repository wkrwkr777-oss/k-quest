"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { AntiFraud } from "@/lib/utils";

export function AIConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, t, addToast } = useStore(); // Get t from store
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: t.ai.welcome } // Use translation for initial state
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Update initial message when language changes
    useEffect(() => {
        setMessages(prev => [
            {
                role: 'ai',
                text: t.ai.welcome
            },
            ...prev.slice(1)
        ]);
    }, [language, t]); // Add t to dependency

    const handleSend = () => {
        if (!input.trim()) return;

        // Anti-Fraud Check
        const fraudType = AntiFraud.detect(input);
        if (fraudType) {
            const warning = AntiFraud.getWarningMessage(fraudType);
            // Show warning as a system message in chat
            setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'ai', text: warning }]);
            setInput("");
            return;
        }

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            const randomResponse = t.ai.responses[Math.floor(Math.random() * t.ai.responses.length)];
            setMessages(prev => [...prev, { role: 'ai', text: randomResponse }]);
        }, 1000);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 p-4 bg-[#D4AF37] text-[#1A1A1A] rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-110 transition-transform duration-300 group ${isOpen ? 'hidden' : 'flex'}`}
            >
                <MessageSquareText className="w-6 h-6" />
                <span className="absolute right-full mr-4 bg-[#1A1A1A] text-[#D4AF37] text-xs px-3 py-1 rounded border border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
                    {t.ai.title}
                </span>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-0 right-0 w-full md:bottom-6 md:right-6 md:w-[400px] h-[80vh] md:h-[600px] bg-[#1A1A1A] border-t md:border border-[#333] shadow-2xl z-50 flex flex-col animate-fade-in rounded-t-2xl md:rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-[#333] bg-[#262626] flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                <MessageSquareText className="w-6 h-6 text-[#1A1A1A]" />
                            </div>
                            <div>
                                <h3 className="text-white font-serif">{t.ai.title}</h3>
                                <p className="text-[#D4AF37] text-[10px] uppercase tracking-wider">{t.ai.subtitle}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors p-2"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                    ? 'bg-[#D4AF37] text-[#1A1A1A] rounded-br-none'
                                    : 'bg-[#262626] text-gray-200 border border-[#333] rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[#333] bg-[#1A1A1A] shrink-0">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={t.ai.placeholder}
                                className="flex-1 bg-[#262626] border border-[#333] text-white text-sm px-3 py-2 rounded-md focus:outline-none focus:border-[#D4AF37]"
                            />
                            <Button size="sm" onClick={handleSend} className="px-3 bg-[#D4AF37] text-[#1A1A1A] hover:bg-[#b5952f]">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
