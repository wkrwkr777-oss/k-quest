"use client";

import { QuestCard } from "@/components/QuestCard";
import { Button } from "@/components/ui/Button";
import { Search, SlidersHorizontal, Map as MapIcon, List, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Quest {
    id: string;
    title: string;
    reward: string;
    location: string;
    time?: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
}

export default function QuestsPage() {
    const { t } = useStore();
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [quests, setQuests] = useState<Quest[]>([]);
    const [filteredQuests, setFilteredQuests] = useState<Quest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['all', 'Dining', 'Photography', 'Transport', 'Shopping', 'Culture', 'Exclusive'];
    const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

    // Load quests from database
    useEffect(() => {
        loadQuests();
    }, []);

    // Apply filters whenever search or filter criteria change
    useEffect(() => {
        applyFilters();
    }, [searchQuery, selectedCategory, selectedDifficulty, priceRange, quests]);

    const loadQuests = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('quests')
                .select('*')
                .eq('status', 'open')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform database data to Quest format
            const transformedQuests: Quest[] = (data || []).map((q: any) => ({
                id: q.id,
                title: q.title,
                reward: `$${q.reward.toFixed(2)}`,
                location: q.location,
                difficulty: q.difficulty as "Easy" | "Medium" | "Hard",
                category: q.category,
            }));

            setQuests(transformedQuests);
        } catch (error) {
            console.error('Failed to load quests:', error);
            // Fallback to mock data if DB fails
            setQuests(t.data.quests.map((q: any) => ({
                ...q,
                difficulty: q.difficulty as "Easy" | "Medium" | "Hard",
            })));
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...quests];

        // Search filter (title, location, category)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((quest) =>
                quest.title.toLowerCase().includes(query) ||
                quest.location.toLowerCase().includes(query) ||
                quest.category.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((quest) => quest.category === selectedCategory);
        }

        // Difficulty filter
        if (selectedDifficulty !== 'all') {
            filtered = filtered.filter((quest) => quest.difficulty === selectedDifficulty);
        }

        // Price range filter
        filtered = filtered.filter((quest) => {
            const price = parseFloat(quest.reward.replace('$', ''));
            return price >= priceRange[0] && price <= priceRange[1];
        });

        setFilteredQuests(filtered);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedDifficulty('all');
        setPriceRange([0, 1000]);
        setShowFilters(false);
    };

    const activeFiltersCount =
        (selectedCategory !== 'all' ? 1 : 0) +
        (selectedDifficulty !== 'all' ? 1 : 0) +
        (priceRange[0] !== 0 || priceRange[1] !== 1000 ? 1 : 0);

    return (
        <main className="min-h-screen bg-[#1A1A1A] pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-[1400px]">
                {/* Header */}
                <div className="text-center mb-20">
                    <p className="text-[#D4AF37] text-sm uppercase tracking-[0.2em] mb-4">{t.quest.subtitle}</p>
                    <h1 className="text-5xl md:text-6xl font-serif text-white mb-8">
                        {t.quest.title}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto font-light">
                        {t.quest.description}
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="sticky top-24 z-30 bg-[#1A1A1A]/95 backdrop-blur-md py-6 mb-12 border-b border-[#333]">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t.common.search}
                                    className="w-full bg-[#262626] border border-[#333] text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-600"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <button
                                onClick={() => resetFilters()}
                                className={`text-xs border px-4 py-2 transition-colors ${activeFiltersCount === 0
                                        ? 'border-[#D4AF37] text-[#1A1A1A] bg-[#D4AF37]'
                                        : 'border-[#333] text-white hover:border-[#D4AF37]'
                                    }`}
                            >
                                {t.filters.all}
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="p-3 border border-[#333] text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors relative"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                {activeFiltersCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                            <div className="h-8 w-[1px] bg-[#333] mx-2" />
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 border transition-colors ${viewMode === 'list' ? 'bg-[#D4AF37] text-[#1A1A1A] border-[#D4AF37]' : 'border-[#333] text-white hover:border-[#D4AF37]'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`p-3 border transition-colors ${viewMode === 'map' ? 'bg-[#D4AF37] text-[#1A1A1A] border-[#D4AF37]' : 'border-[#333] text-white hover:border-[#D4AF37]'}`}
                            >
                                <MapIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-[#111] border border-[#333] rounded-lg animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-medium">상세 필터</h3>
                                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Category Filter */}
                                <div>
                                    <label className="text-gray-400 text-sm mb-2 block">카테고리</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full bg-[#262626] border border-[#333] text-white px-4 py-2 rounded focus:outline-none focus:border-[#D4AF37]"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat === 'all' ? '전체' : cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Difficulty Filter */}
                                <div>
                                    <label className="text-gray-400 text-sm mb-2 block">난이도</label>
                                    <select
                                        value={selectedDifficulty}
                                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                                        className="w-full bg-[#262626] border border-[#333] text-white px-4 py-2 rounded focus:outline-none focus:border-[#D4AF37]"
                                    >
                                        {difficulties.map((diff) => (
                                            <option key={diff} value={diff}>
                                                {diff === 'all' ? '전체' : diff}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div>
                                    <label className="text-gray-400 text-sm mb-2 block">
                                        가격 범위: ${priceRange[0]} - ${priceRange[1]}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                            className="w-1/2 bg-[#262626] border border-[#333] text-white px-3 py-2 rounded focus:outline-none focus:border-[#D4AF37]"
                                            placeholder="Min"
                                        />
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                            className="w-1/2 bg-[#262626] border border-[#333] text-white px-3 py-2 rounded focus:outline-none focus:border-[#D4AF37]"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button variant="ghost" onClick={resetFilters}>
                                    초기화
                                </Button>
                                <Button variant="primary" onClick={() => setShowFilters(false)}>
                                    적용 ({filteredQuests.length}개)
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Active Filters Display */}
                    {activeFiltersCount > 0 && !showFilters && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-gray-400 text-sm">활성 필터:</span>
                            {selectedCategory !== 'all' && (
                                <FilterTag label={`Category: ${selectedCategory}`} onRemove={() => setSelectedCategory('all')} />
                            )}
                            {selectedDifficulty !== 'all' && (
                                <FilterTag label={`Difficulty: ${selectedDifficulty}`} onRemove={() => setSelectedDifficulty('all')} />
                            )}
                            {(priceRange[0] !== 0 || priceRange[1] !== 1000) && (
                                <FilterTag
                                    label={`$${priceRange[0]} - $${priceRange[1]}`}
                                    onRemove={() => setPriceRange([0, 1000])}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6 text-gray-400 text-sm">
                    {isLoading ? '로딩 중...' : `${filteredQuests.length}개의 퀘스트 찾음`}
                </div>

                {/* Content */}
                {viewMode === 'list' ? (
                    isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-[#111] border border-[#333] p-6 rounded animate-pulse">
                                    <div className="h-6 bg-[#262626] rounded mb-4"></div>
                                    <div className="h-4 bg-[#262626] rounded mb-2"></div>
                                    <div className="h-4 bg-[#262626] rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredQuests.length === 0 ? (
                        <div className="text-center py-20">
                            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl text-white mb-2">검색 결과가 없습니다</h3>
                            <p className="text-gray-400 mb-6">다른 검색어나 필터를 시도해보세요</p>
                            <Button variant="primary" onClick={resetFilters}>
                                필터 초기화
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-fade-in">
                            {filteredQuests.map((quest) => (
                                <QuestCard key={quest.id} {...quest} />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="relative w-full h-[600px] bg-[#262626] border border-[#333] rounded-sm overflow-hidden animate-fade-in group">
                        {/* Map View */}
                        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=2662&auto=format&fit=crop')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" />
                        {filteredQuests.map((quest, idx) => (
                            <div
                                key={quest.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
                                style={{
                                    top: `${30 + (idx * 15) % 50}%`,
                                    left: `${20 + (idx * 20) % 60}%`,
                                }}
                            >
                                <div className="w-4 h-4 bg-[#D4AF37] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-pulse" />
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 bg-[#1A1A1A] border border-[#D4AF37] p-3 opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none z-10">
                                    <p className="text-[#D4AF37] text-[10px] uppercase tracking-widest mb-1">{quest.category}</p>
                                    <p className="text-white text-xs font-serif truncate">{quest.title}</p>
                                    <p className="text-gray-400 text-[10px] mt-1">{quest.reward}</p>
                                </div>
                            </div>
                        ))}
                        <div className="absolute bottom-8 right-8 bg-[#1A1A1A]/90 p-4 border border-[#333] max-w-xs">
                            <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">{filteredQuests.length} Quests</p>
                            <p className="text-gray-400 text-xs">마커를 호버하여 자세히 보기</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1 bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-xs">
            {label}
            <button onClick={onRemove} className="hover:text-white">
                <X className="w-3 h-3" />
            </button>
        </span>
    );
}
