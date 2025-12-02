"use client";

import { useStore } from "@/lib/store";
import { Header } from "@/components/Header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CompanyInfoPage() {
    const { language } = useStore();

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#050505] text-white py-32 font-sans font-light">
                <div className="container mx-auto px-6 max-w-4xl">
                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-12 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        {language === 'ko' ? '홈으로' : 'Back to Home'}
                    </Link>

                    {/* Main Title - Clean Sans-serif */}
                    <h1 className="text-5xl md:text-6xl font-light mb-20 text-center text-white tracking-tight">
                        {language === 'ko' ? 'K-Quest 이야기' : 'About K-Quest'}
                    </h1>

                    {/* Philosophy Section */}
                    <section className="mb-20">
                        <div className="bg-[#0A0A0A] p-12 md:p-16 rounded-3xl border border-white/5">
                            <h2 className="text-3xl md:text-4xl font-light text-white mb-12 text-center tracking-tight">
                                {language === 'ko' ? '서비스 철학' : 'Our Philosophy'}
                            </h2>
                            <div className="space-y-8 text-center max-w-3xl mx-auto">
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                                    {language === 'ko'
                                        ? "K-Quest는 일상의 작은 즐거움을 발견하고 나누는 공간입니다."
                                        : "K-Quest is a space to discover and share the small joys of daily life."}
                                </p>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                                    {language === 'ko'
                                        ? "거창한 목표보다는, 누구나 쉽게 참여하고 소소한 성취감을 느낄 수 있는 건강한 퀘스트 문화를 만들어가고자 합니다."
                                        : "We aim to create a healthy quest culture where anyone can easily participate and feel a sense of accomplishment."}
                                </p>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                                    {language === 'ko'
                                        ? "우리는 기술을 통해 사람과 사람을 잇고, 신뢰를 바탕으로 한 안전하고 즐거운 거래 경험을 제공합니다."
                                        : "We connect people through technology and provide a safe and enjoyable transaction experience based on trust."}
                                </p>
                            </div>
                        </div>
                    </section>


                    {/* Copyright - Clean & Minimal */}
                    <div className="mt-24 pt-8 border-t border-white/5 flex flex-col items-center">
                        <div className="text-center text-gray-600 text-xs font-light">
                            <p>© {new Date().getFullYear()} K-Quest. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
