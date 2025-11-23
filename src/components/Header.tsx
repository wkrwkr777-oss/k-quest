"use client";

import Link from "next/link";
import { Search, Menu, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { NotificationCenter } from "@/components/NotificationCenter";

export function Header() {
    const { language, setLanguage, t, user, logout, addToast } = useStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ko' : 'en';
        setLanguage(newLang);
        addToast(newLang === 'en' ? "Language switched to English" : "언어가 한국어로 변경되었습니다", "info");
    };

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
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? "bg-[#1A1A1A]/95 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"}`}>
                <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                    {/* Logo - LEFT SIDE - GOLD COLOR */}
                    <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                        <div className="w-8 h-8 md:w-10 md:h-10 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif text-lg md:text-xl group-hover:bg-[#D4AF37] group-hover:text-[#1A1A1A] transition-colors duration-500">
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg md:text-2xl font-serif tracking-widest transition-colors" style={{ color: '#D4AF37 !important', fontWeight: 600 }}>
                                K-QUEST
                            </span>
                            <span className="text-[8px] md:text-[10px] tracking-[0.3em] uppercase hidden sm:block" style={{ color: '#D4AF37 !important' }}>
                                {language === 'en' ? "Premium Concierge" : "프리미엄 컨시어지"}
                            </span>
                        </div>
                    </Link>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-6">
                        {/* Navigation (Desktop) */}
                        <nav className="hidden md:flex items-center gap-12">
                            <Link href="/quests/new" className="text-sm font-medium uppercase tracking-widest transition-colors hover:text-[#D4AF37]" style={{ color: '#FFFFFF' }}>
                                {t.nav.postQuest || "Post Quest"}
                            </Link>
                            <Link href="/quests" className="text-sm font-medium uppercase tracking-widest transition-colors hover:text-[#D4AF37]" style={{ color: '#FFFFFF' }}>
                                {t.nav.collection}
                            </Link>
                            <Link href="/company" className="text-sm font-medium uppercase tracking-widest transition-colors hover:text-[#D4AF37]" style={{ color: '#FFFFFF' }}>
                                {t.nav.about}
                            </Link>
                            <Link href="/wallet" className="text-sm font-medium uppercase tracking-widest transition-colors hover:text-[#D4AF37]" style={{ color: '#FFFFFF' }}>
                                {t.nav.portfolio}
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3 md:gap-6">
                            <button onClick={toggleLanguage} className="text-white hover:text-[#D4AF37] transition-colors flex items-center gap-1 text-xs uppercase tracking-wider">
                                <Globe className="h-4 w-4" />
                                {language === 'en' ? "KO" : "EN"}
                            </button>

                            {/* Notification Center (only when logged in) */}
                            {user && <NotificationCenter />}

                            <button className="text-white hover:text-[#D4AF37] transition-colors hidden md:block">
                                <Search className="h-5 w-5" />
                            </button>

                            <Button
                                variant={user ? "ghost" : "secondary"}
                                size="sm"
                                onClick={handleLogin}
                                className={`hidden md:flex ${user ? "text-[#D4AF37] border-[#D4AF37]" : "h-10 px-6"}`}
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
            <div className={`fixed inset-0 bg-[#1A1A1A] z-[60] transition-transform duration-500 ease-in-out ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"} md:hidden pt-32 px-6`}>
                <nav className="flex flex-col gap-8 text-center">
                    <Link
                        href="/quests"
                        className="text-2xl font-serif text-white hover:text-[#D4AF37] transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t.nav.collection}
                    </Link>
                    <Link
                        href="/company"
                        className="text-2xl font-serif text-white hover:text-[#D4AF37] transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t.nav.about}
                    </Link>
                    <Link
                        href="/wallet"
                        className="text-2xl font-serif text-white hover:text-[#D4AF37] transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t.nav.portfolio}
                    </Link>
                    <div className="h-[1px] bg-[#333] w-full my-4" />
                    <Button
                        variant={user ? "ghost" : "secondary"}
                        size="lg"
                        onClick={() => {
                            handleLogin();
                            setMobileMenuOpen(false);
                        }}
                        className="w-full"
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
