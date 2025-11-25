"use client";

import { Construction } from "lucide-react";
import Link from "next/link";

export default function QuestsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                <Construction className="w-20 h-20 text-[#D4AF37] mx-auto animate-pulse" />

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif text-white">퀘스트 페이지 준비중</h1>
                    <p className="text-xl text-gray-400">정식 오픈 시 사용 가능합니다.</p>
                </div>

                <Link
                    href="/"
                    className="inline-block mt-8 px-8 py-3 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#C4A037] transition-colors"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </main>
    );
}
