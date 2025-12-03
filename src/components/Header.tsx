"use client";

import Link from "next/link";
import { Search, Menu, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { NotificationCenter } from "@/components/NotificationCenter";
import { InstallAppButton } from "@/components/InstallAppButton";

export function Header() {
    const { language, setLanguage, t, user, logout, addToast } = useStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    const languages = [
        { code: 'ko', label: '한국어', flag: '🇰🇷' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'ja', label: '日本語', flag: '🇯🇵' },
        { code: 'zh', label: '中文', flag: '🇨🇳' },
        { code: 'ar', label: 'العربية', flag: '🇦🇪' },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, []);

    const handleLogin = () => {
        if (user) {
            logout();
            addToast(language === 'en' ? "Signed out successfully" : "로그아웃 되었습니다", "info");
        } else {
            window.location.href = '/auth/login';
        }
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || mobileMenuOpen ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/5" : "bg-gradient-to-b from-black/80 to-transparent"}`}>
                <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                    {/* Logo - LEFT SIDE - Text Only */}
                    <Link href="/" className="flex flex-col group">
                        <span className="text-2xl font-sans font-medium tracking-widest transition-colors text-[#D4AF37] group-hover:text-[#F4CF57]">
                            K-QUEST
                        </span>
                        <span className="text-[11px] tracking-[0.3em] uppercase hidden sm:block text-[#D4AF37] font-sans font-semibold">
                            {language === 'en' ? "All Quests in Korea" : "한국의 모든 퀘스트"}
                        </span>
                    </Link>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-8">
                        {/* Navigation (Desktop) */}
                        <nav className="hidden md:flex items-center gap-12">
                            <Link href="/ai-assistant" className="text-sm font-medium uppercase tracking-widest text-[#00F0FF] hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] transition-all font-sans flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
                                AI Assistant
                            </Link>
                            <Link href="/quests/create" className="text-sm font-medium uppercase tracking-widest text-white hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-all font-sans">
                                {t.nav.postQuest || "Post Quest"}
                            </Link>
                            <Link href="/quests" className="text-sm font-medium uppercase tracking-widest text-white hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-all font-sans">
                                {t.nav.collection}
                            </Link>
                            <Link href="/company" className="text-sm font-medium uppercase tracking-widest text-white hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-all font-sans">
                                {t.nav.about}
                            </Link>
                            <Link href="/wallet" className="text-sm font-medium uppercase tracking-widest text-white hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-all font-sans">
                                {t.nav.portfolio}
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-6">
                            {/* Language Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                                    className="text-white hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-all flex items-center gap-2 text-sm font-medium font-sans px-3 py-2 rounded-lg hover:bg-white/5"
                                >
                                    <Globe className="h-4 w-4" />
                                    <span className="text-2xl">{languages.find(l => l.code === language)?.flag}</span>
                                </button>

                                {langMenuOpen && (
                                    <>
                                        {/* 배경 클릭 시 닫기 */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setLangMenuOpen(false)}
                                        />

                                        {/* 드롭다운 메뉴 */}
                                        <div className="absolute right-0 mt-2 min-w-[250px] bg-black/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        setLanguage(lang.code as any);
                                                        setLangMenuOpen(false);
                                                        addToast(`Language: ${lang.label}`, 'info');
                                                    }}
                                                    className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-all duration-200 border-b border-white/5 last:border-0 ${language === lang.code
                                                        ? 'bg-[#D4AF37]/20 text-[#FFD700]'
                                                        : 'text-white/90 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    <span className="text-2xl flex-shrink-0">{lang.flag}</span>
                                                    <span className="text-lg font-medium flex-1">{lang.label}</span>
                                                    {language === lang.code && (
                                                        <span className="text-[#FFD700] text-xl flex-shrink-0">✓</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Notification Center (only when logged in) */}
                            {user && <NotificationCenter />}

                            <Link href="/quests">
                                <button className="text-gray-400 hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-all hidden md:block">
                                    <Search className="h-4 w-4" />
                                </button>
                            </Link>

                            {/* App Install Button */}
                            <InstallAppButton />

                            <Button
                                variant={user ? "ghost" : "secondary"}
                                size="sm"
                                onClick={handleLogin}
                                className={`hidden md:flex ${user ? "text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10" : "bg-[#D4AF37] text-black hover:bg-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] border-none rounded-none px-8 py-2 tracking-widest uppercase text-sm font-medium font-sans transition-all"}`}
                            >
                                {user ? (
                                    <span className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        {user === 'foreigner' ? (language === 'en' ? "Traveler" : "여행자") : (language === 'en' ? "Expert" : "전문가")}
                                    </span>
                                ) : (
                                    t.nav.signIn
                                )}
                            </Button>

                            <button
                                className="md:hidden text-white hover:text-[#D4AF37] transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-[#050505] z-[60] transition-transform duration-500 ease-in-out ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"} md:hidden pt-32 px-6`}>
                <nav className="flex flex-col gap-8 text-center">
                    <Link
                        href="/ai-assistant"
                        className="text-3xl font-sans font-medium text-[#00F0FF] hover:text-white transition-colors flex items-center justify-center gap-3"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span className="w-3 h-3 bg-[#00F0FF] rounded-full animate-pulse" />
                        AI Assistant
                    </Link>
                    <Link
                        href="/quests"
                        className="text-3xl font-sans font-medium text-white hover:text-[#D4AF37] transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t.nav.collection}
                    </Link>
                    <Link
                        href="/company"
                        className="text-3xl font-sans font-medium text-white hover:text-[#D4AF37] transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t.nav.about}
                    </Link>
                    <Link
                        href="/wallet"
                        className="text-3xl font-sans font-medium text-white hover:text-[#D4AF37] transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t.nav.portfolio}
                    </Link>
                    <div className="h-[1px] bg-white/10 w-full my-8" />
                    <Button
                        variant={user ? "ghost" : "secondary"}
                        size="lg"
                        onClick={() => {
                            handleLogin();
                            setMobileMenuOpen(false);
                        }}
                        className="w-full rounded-none border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black uppercase tracking-widest font-sans font-medium"
                    >
                        {user ? (
                            <span className="flex items-center justify-center gap-2">
                                <User className="h-4 w-4" />
                                {user === 'foreigner' ? (language === 'en' ? "Traveler" : "여행자") : (language === 'en' ? "Expert" : "전문가")}
                            </span>
                        ) : (
                            t.nav.signIn
                        )}
                    </Button>
                </nav>
            </div>
        </>
    );
}
