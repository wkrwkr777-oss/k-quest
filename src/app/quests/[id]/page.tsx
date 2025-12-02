"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    MapPin, Calendar, DollarSign, Clock, Share2, Flag,
    MessageCircle, Shield, CheckCircle2, Star, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { PremiumCard, GlassCard, VerifiedBadge, PremiumButton, TierBadge } from '@/components/PremiumComponents';
import { useStore } from '@/lib/store';

export default function QuestDetail() {
    const params = useParams();
    const { t, language } = useStore();
    const [isApplying, setIsApplying] = useState(false);

    // Get quest data from translations based on ID
    const questId = params.id as string;

    // Safely get quest data with fallback
    let quest = null;
    try {
        if (t?.data?.quests && Array.isArray(t.data.quests)) {
            quest = t.data.quests.find((q: any) => q.id === questId) || t.data.quests[0];
        }
    } catch (error) {
        console.error('Error finding quest:', error);
    }

    // Fallback demo quest if translation data not available
    if (!quest) {
        quest = {
            id: questId,
            title: language === 'ko' ? "퀘스트 정보" : "Quest Information",
            description: language === 'ko' ? "퀘스트 상세 정보를 로딩 중입니다..." : "Loading quest details...",
            category: language === 'ko' ? "기타" : "Other",
            location: "Seoul",
            time: "1 hour",
            difficulty: "Medium",
            reward: "$10.00",
            requester: "User"
        };
    }

    // Enhanced quest details
    const questDetails = {
        ...quest,
        budget: quest.reward,
        deadline: "2025-12-15",
        postedBy: {
            name: quest.requester || "User",
            tier: "platinum",
            rating: 4.9,
            reviews: 128,
            verified: true
        },
        requirements: [
            `${quest.difficulty || 'Medium'} difficulty level`,
            `Estimated time: ${quest.time || '1 hour'}`,
            `Location: ${quest.location || 'Seoul'}`
        ],
        images: [
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000"
        ]
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: quest.title,
                    text: quest.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Fox Strategy: Structured Data for Google Rich Snippets
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": quest.title,
        "description": quest.description,
        "provider": {
            "@type": "Person",
            "name": questDetails.postedBy.name
        },
        "areaServed": {
            "@type": "City",
            "name": quest.location
        },
        "offers": {
            "@type": "Offer",
            "price": quest.reward.replace(/[^0-9.]/g, ''),
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-12 px-6">
            {/* Inject JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link href="/quests" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-8 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    {language === 'ko' ? '퀘스트 목록으로' : 'Back to Quests'}
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Image */}
                        <div className="relative h-96 rounded-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
                            <img
                                src={questDetails.images[0]}
                                alt={quest.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-6 left-6 z-20">
                                <span className="px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full mb-3 inline-block">
                                    {quest.category}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{quest.title}</h1>
                                <div className="flex items-center gap-4 text-gray-300 text-sm">
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#D4AF37]" /> {quest.location}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#D4AF37]" /> {language === 'ko' ? '2시간 전' : 'Posted 2 hours ago'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <GlassCard>
                            <h2 className="text-xl font-bold text-white mb-4">{language === 'ko' ? '퀘스트 소개' : 'About this Quest'}</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                {quest.description}
                            </p>

                            <h3 className="text-lg font-bold text-white mb-3">{language === 'ko' ? '요구사항' : 'Requirements'}</h3>
                            <ul className="space-y-2 mb-6">
                                {questDetails.requirements.map((req, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-300">
                                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex gap-4 pt-6 border-t border-[#333]">
                                <div className="flex-1 p-4 bg-[#1A1A1A] rounded-xl border border-[#333]">
                                    <div className="text-gray-500 text-sm mb-1">{language === 'ko' ? '보상금' : 'Reward'}</div>
                                    <div className="text-xl font-bold text-white flex items-center gap-1">
                                        <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                                        {quest.reward}
                                    </div>
                                </div>
                                <div className="flex-1 p-4 bg-[#1A1A1A] rounded-xl border border-[#333]">
                                    <div className="text-gray-500 text-sm mb-1">{language === 'ko' ? '마감일' : 'Deadline'}</div>
                                    <div className="text-xl font-bold text-white flex items-center gap-1">
                                        <Calendar className="w-5 h-5 text-[#D4AF37]" />
                                        {questDetails.deadline}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Trust Safety */}
                        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 flex items-start gap-4">
                            <Shield className="w-8 h-8 text-[#D4AF37] shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{language === 'ko' ? '100% 안전 결제' : '100% Secure Payment'}</h3>
                                <p className="text-gray-400 text-sm">
                                    {language === 'ko'
                                        ? '결제 금액은 퀘스트가 만족스럽게 완료될 때까지 안전하게 보관됩니다. $1M 보험으로 보호됩니다.'
                                        : 'Your payment is held in our secure escrow system until the quest is completed to your satisfaction. Backed by our $1M insurance policy.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action Card */}
                        <PremiumCard className="sticky top-24">
                            <div className="mb-6">
                                <div className="text-gray-400 text-sm mb-1">{language === 'ko' ? '예상 보상' : 'Estimated Budget'}</div>
                                <div className="text-3xl font-bold text-white">{quest.reward}</div>
                            </div>

                            <PremiumButton
                                className="w-full mb-3"
                                onClick={() => setIsApplying(true)}
                            >
                                {language === 'ko' ? '제안서 제출' : 'Submit Proposal'}
                            </PremiumButton>

                            <button className="w-full py-3 bg-[#1A1A1A] border border-[#333] text-white font-bold rounded-xl hover:bg-[#262626] transition-colors flex items-center justify-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                {language === 'ko' ? '유저 연락' : 'Contact User'}
                            </button>

                            <div className="mt-6 pt-6 border-t border-[#333]">
                                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                    <span>{language === 'ko' ? '제안서' : 'Proposals'}</span>
                                    <span className="text-white font-bold">12</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span>{language === 'ko' ? '평균 입찰가' : 'Avg. Bid'}</span>
                                    <span className="text-white font-bold">{quest.reward}</span>
                                </div>
                            </div>
                        </PremiumCard>

                        {/* User Profile */}
                        <GlassCard>
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">{language === 'ko' ? '작성자' : 'Posted By'}</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-full flex items-center justify-center text-black font-bold text-xl">
                                    {questDetails.postedBy.name[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{questDetails.postedBy.name}</span>
                                        <VerifiedBadge level={3} />
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-[#D4AF37]">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="font-bold">{questDetails.postedBy.rating}</span>
                                        <span className="text-gray-500">({questDetails.postedBy.reviews} {language === 'ko' ? '리뷰' : 'reviews'})</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <TierBadge tier={questDetails.postedBy.tier as any} />
                            </div>
                            <div className="text-xs text-gray-500">
                                {language === 'ko' ? '가입: 2024 • 마지막 활동: 10분 전' : 'Member since 2024 • Last active 10m ago'}
                            </div>
                        </GlassCard>

                        {/* Share & Report */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleShare}
                                className="flex-1 py-2 text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                <Share2 className="w-4 h-4" /> {language === 'ko' ? '공유' : 'Share'}
                            </button>
                            <button className="flex-1 py-2 text-gray-400 hover:text-red-400 text-sm flex items-center justify-center gap-2 transition-colors">
                                <Flag className="w-4 h-4" /> {language === 'ko' ? '신고' : 'Report'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
