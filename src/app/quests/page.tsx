"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, Calendar, DollarSign, Star } from 'lucide-react';
import { PremiumCard, TierBadge, VerifiedBadge, PremiumButton } from '@/components/PremiumComponents';
import { useStore } from '@/lib/store';

// Mock Data


export default function QuestsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { userQuests, fetchQuests } = useStore();

    useEffect(() => {
        fetchQuests();
    }, []);

    // userQuests가 undefined일 경우를 대비해 빈 배열로 초기화
    const safeUserQuests = userQuests || [];
    const allQuests = [...safeUserQuests];

    const categories = ["All", "Dining", "Experience", "Business", "Nightlife", "Shopping"];

    // Filter quests based on search and category
    const filteredQuests = allQuests.filter(quest => {
        const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quest.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || quest.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Explore Quests</h1>
                        <p className="text-gray-400">Find exclusive opportunities or request premium services</p>
                    </div>
                    <Link href="/quests/create">
                        <PremiumButton icon={<Star className="w-5 h-5" />}>
                            Post a Quest
                        </PremiumButton>
                    </Link>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search for quests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-3 rounded-xl whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? "bg-[#D4AF37] text-black font-bold"
                                    : "bg-[#1A1A1A] text-gray-400 border border-[#333] hover:border-[#D4AF37]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quest Grid */}
                {filteredQuests.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredQuests.map((quest) => (
                            <Link href={`/quests/${quest.id}`} key={quest.id}>
                                <PremiumCard className="h-full flex flex-col group cursor-pointer">
                                    {/* Image */}
                                    <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                        <img
                                            src={quest.image || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80"}
                                            alt={quest.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 z-20">
                                            <TierBadge tier={quest.tier as any || 'silver'} />
                                        </div>
                                        <div className="absolute bottom-3 left-3 z-20">
                                            <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10">
                                                {quest.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                                            {quest.title}
                                        </h3>

                                        <div className="space-y-2 mb-4 flex-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                                                {quest.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                                                Due {quest.deadline || 'Open'}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                                                Budget: <span className="text-white font-bold">{quest.budget || quest.reward}</span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="pt-4 border-t border-[#333] flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                                                    {quest.user?.name?.[0] || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{quest.user?.name || 'User'}</span>
                                                    {quest.user?.verified && <VerifiedBadge level={quest.user.level || 1} />}
                                                </div>
                                            </div>
                                            <button className="text-sm text-[#D4AF37] font-bold hover:underline">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </PremiumCard>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6 border border-[#333]">
                            <Star className="w-10 h-10 text-[#D4AF37] opacity-50" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Quests Found</h3>
                        <p className="text-gray-400 max-w-md mb-8">
                            Be the first to post a quest and start connecting with people!
                        </p>
                        <Link href="/quests/create">
                            <PremiumButton size="lg">
                                첫 퀘스트를 등록해보세요!
                            </PremiumButton>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
