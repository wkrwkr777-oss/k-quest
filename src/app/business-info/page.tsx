"use client";

import { useStore } from "@/lib/store";
import { Header } from "@/components/Header";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, FileText } from "lucide-react";

export default function BusinessInfoPage() {
    const { language } = useStore();

    const businessInfo = {
        ko: {
            title: "사업자 정보",
            subtitle: "전자상거래 등에서의 소비자보호에 관한 법률에 따른 사업자 정보 공개",
            companyName: "상호명",
            companyNameValue: "포텐포텐",
            companyNameEn: "영문명",
            companyNameEnValue: "potenpoten",
            representative: "대표자",
            representativeValue: "박세희",
            businessNumber: "사업자등록번호",
            businessNumberValue: "375-34-01719",
            ecommerceNumber: "통신판매업 신고번호",
            ecommerceNumberValue: "제2025-용인수지-3105호",
            address: "사업장 소재지",
            addressValue: "경기도 용인시 수지구 풍덕대로2790번길 7, 3층 302-S86호 (죽전동)",
            email: "고객센터 이메일",
            emailValue: "wkrwkr777@gmail.com",
            establishedDate: "사업 개시일",
            establishedDateValue: "2025년 11월 26일",
            businessType: "업태",
            businessTypeValue: "정보처리산업",
            businessItem: "종목",
            businessItemValue: "플랫폼 및 기타 인터넷 정보 매개 서비스업"
        },
        en: {
            title: "Business Information",
            subtitle: "Legal business information disclosure in accordance with E-commerce Consumer Protection Act",
            companyName: "Company Name (KR)",
            companyNameValue: "포텐포텐 (potenpoten)",
            companyNameEn: "Company Name (EN)",
            companyNameEnValue: "potenpoten",
            representative: "Representative",
            representativeValue: "Park Se-hee",
            businessNumber: "Business Registration",
            businessNumberValue: "375-34-01719",
            ecommerceNumber: "E-commerce License",
            ecommerceNumberValue: "No. 2025-Yongin Suji-3105",
            address: "Business Address",
            addressValue: "302-S86, 3rd Floor, 7, Pungdeokdae-ro 2790beon-gil, Suji-gu, Yongin-si, Gyeonggi-do, Republic of Korea",
            email: "Customer Service",
            emailValue: "wkrwkr777@gmail.com",
            establishedDate: "Establishment Date",
            establishedDateValue: "November 26, 2025",
            businessType: "Business Type",
            businessTypeValue: "Information Processing Industry",
            businessItem: "Business Item",
            businessItemValue: "Platform and Internet Information Mediation Services"
        }
    };

    const t = language === 'ko' ? businessInfo.ko : businessInfo.en;

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

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-6xl font-light mb-6 text-center text-white tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>

                    {/* Business Info Card */}
                    <div className="bg-[#0A0A0A] p-12 md:p-16 rounded-3xl border border-white/5 mb-12">
                        <div className="space-y-8">
                            {/* Company Name */}
                            <InfoRow label={t.companyName} value={t.companyNameValue} />
                            <InfoRow label={t.companyNameEn} value={t.companyNameEnValue} />

                            <div className="border-t border-white/5 my-6" />

                            {/* Representative */}
                            <InfoRow label={t.representative} value={t.representativeValue} />

                            <div className="border-t border-white/5 my-6" />

                            {/* Business Numbers */}
                            <InfoRow label={t.businessNumber} value={t.businessNumberValue} />
                            <InfoRow label={t.ecommerceNumber} value={t.ecommerceNumberValue} />

                            <div className="border-t border-white/5 my-6" />

                            {/* Address */}
                            <InfoRow
                                label={t.address}
                                value={t.addressValue}
                                icon={<MapPin className="w-5 h-5 text-[#D4AF37]" />}
                            />

                            <div className="border-t border-white/5 my-6" />

                            {/* Contact */}
                            <InfoRow
                                label={t.email}
                                value={t.emailValue}
                                icon={<Mail className="w-5 h-5 text-[#D4AF37]" />}
                                isLink
                            />

                            <div className="border-t border-white/5 my-6" />

                            {/* Business Type */}
                            <InfoRow label={t.establishedDate} value={t.establishedDateValue} />
                            <InfoRow label={t.businessType} value={t.businessTypeValue} />
                            <InfoRow label={t.businessItem} value={t.businessItemValue} />
                        </div>
                    </div>

                    {/* Additional Links */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link href="/terms" className="p-6 bg-[#0A0A0A] border border-[#333] rounded-xl hover:border-[#D4AF37] transition-colors group text-center">
                            <FileText className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                            <h4 className="text-white font-bold mb-2 group-hover:text-[#D4AF37]">
                                {language === 'ko' ? '이용약관' : 'Terms of Service'}
                            </h4>
                        </Link>
                        <Link href="/privacy" className="p-6 bg-[#0A0A0A] border border-[#333] rounded-xl hover:border-[#D4AF37] transition-colors group text-center">
                            <FileText className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                            <h4 className="text-white font-bold mb-2 group-hover:text-[#D4AF37]">
                                {language === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
                            </h4>
                        </Link>
                        <Link href="/faq" className="p-6 bg-[#0A0A0A] border border-[#333] rounded-xl hover:border-[#D4AF37] transition-colors group text-center">
                            <FileText className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                            <h4 className="text-white font-bold mb-2 group-hover:text-[#D4AF37]">
                                FAQ
                            </h4>
                        </Link>
                    </div>

                    {/* Copyright */}
                    <div className="mt-24 pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-600 text-xs">
                            © {new Date().getFullYear()} {t.companyNameValue}. All rights reserved.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}

// Helper Component
function InfoRow({ label, value, icon, isLink }: { label: string; value: string; icon?: React.ReactNode; isLink?: boolean }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-2 md:w-64">
                {icon}
                <span className="text-gray-500 text-sm uppercase tracking-wider">{label}</span>
            </div>
            {isLink ? (
                <a href={`mailto:${value}`} className="text-white text-lg hover:text-[#D4AF37] transition-colors">
                    {value}
                </a>
            ) : (
                <span className="text-white text-lg">{value}</span>
            )}
        </div>
    );
}
