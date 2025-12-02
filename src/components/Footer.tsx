"use client";

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export function Footer() {
    const { language } = useStore();

    return (
        <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A] py-12 mt-auto">
            <div className="container mx-auto px-6 max-w-[1400px]">
                {/* Main Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-serif text-white mb-1" style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '0.05em' }}>K-Quest</h3>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Premium Concierge in Korea</p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <Link href="/company" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                            {language === 'ko' ? '회사 소개' : 'About'}
                        </Link>
                        <Link href="/faq" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                            FAQ
                        </Link>
                        <Link href="/terms" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                            {language === 'ko' ? '이용약관' : 'Terms'}
                        </Link>
                        <Link href="/privacy" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                            {language === 'ko' ? '개인정보처리방침' : 'Privacy'}
                        </Link>
                        <Link href="/business-info" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                            {language === 'ko' ? '사업자 정보' : 'Business Info'}
                        </Link>
                    </div>

                    {/* Contact */}
                    <div className="text-center md:text-right">
                        <a href="mailto:wkrwkr777@gmail.com" className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors">
                            wkrwkr777@gmail.com
                        </a>
                    </div>
                </div>

                {/* Legal Info - Minimal & Clean */}
                {/* Legal Info - Minimal & Clean */}
                <div className="border-t border-[#1A1A1A] pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                        {/* Copyright */}
                        <p>© {new Date().getFullYear()} K-Quest. All rights reserved.</p>

                        {/* Required Legal Info - Minimal */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <span>{language === 'ko' ? '포텐포텐' : 'potenpoten'}</span>
                            <span>|</span>
                            <span>{language === 'ko' ? '사업자' : 'Business'}: 375-34-01719</span>
                            <span>|</span>
                            <span>{language === 'ko' ? '통신판매업' : 'E-commerce'}: 제2025-용인수지-3105호</span>
                        </div>
                    </div>

                    {/* Disclaimer - Legal Protection */}
                    <div className="mt-4 text-[10px] text-gray-700 text-center md:text-left leading-relaxed">
                        {language === 'ko' ? (
                            <p>K-Quest는 통신판매중개자이며 통신판매의 당사자가 아닙니다. 따라서 K-Quest는 상품·거래정보 및 거래에 대하여 책임을 지지 않습니다.</p>
                        ) : (
                            <p>K-Quest is an intermediary platform and is not a party to the transactions. K-Quest is not responsible for the services, transaction information, or any disputes between users.</p>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}

