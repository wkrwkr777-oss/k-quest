import { Metadata } from 'next';
import Link from 'next/link';
import { Music, MapPin, Camera, Heart, Star, Sparkles, Users, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Ultimate BTS Tour Seoul 2025 | Blackpink & K-Pop Experience Guide',
    description: 'Exclusive BTS, Blackpink, Seventeen, Stray Kids tour in Seoul. Visit HYBE building, SM Entertainment, YG, music show tapings, fan cafe hotspots. Book your K-Pop dream tour with local ARMY guides.',
    keywords: 'BTS tour Seoul, Blackpink tour Korea, K-Pop experience Seoul, HYBE building tour, SM Entertainment visit, YG Entertainment Seoul, ARMY Seoul tour, K-Pop concert tickets Korea, BTS filming locations, Seventeen tour, Stray Kids Seoul, K-Pop fan meeting Korea, K-Pop merchandise shopping Seoul, Music Bank tickets, Inkigayo tickets',
    openGraph: {
        title: 'Ultimate K-Pop Tour Seoul 2025 | BTS, Blackpink & More',
        description: 'Live your K-Pop dreams! Tour BTS & Blackpink locations with local ARMY guides',
        images: [{ url: '/kpop-tour.jpg', width: 1200, height: 630 }],
    },
};

export default function KPopTourPage() {
    const tours = [
        {
            icon: Music,
            title: 'HYBE & Big 3 Building Tour',
            locations: 'HYBE, SM, YG, JYP Entertainment',
            price: '$120',
            highlights: ['Photo ops outside buildings', 'Company store shopping', 'Fan cafe visits'],
        },
        {
            icon: Camera,
            title: 'BTS Filming Location Tour',
            locations: 'Sangam, Han River, Namsan Tower',
            price: '$150',
            highlights: ['Spring Day locations', 'Run BTS filming spots', 'Professional photo service'],
        },
        {
            icon: Heart,
            title: 'K-Pop Shopping Paradise',
            locations: 'Myeongdong, Gangnam, Hongdae',
            price: '$100',
            highlights: ['Limited edition merch', 'Photo card hunting', 'Pop-up store access'],
        },
        {
            icon: Star,
            title: 'Music Show Recording',
            locations: 'Music Bank, Inkigayo, M Countdown',
            price: '$200',
            highlights: ['Pre-recording access', 'Meet idols live', 'Official lightstick waving'],
        },
    ];

    const kpopGroups = [
        { name: 'BTS', emoji: '💜', color: 'from-purple-500 to-purple-700' },
        { name: 'Blackpink', emoji: '🖤💗', color: 'from-pink-500 to-black' },
        { name: 'Seventeen', emoji: '💎', color: 'from-blue-500 to-cyan-500' },
        { name: 'Stray Kids', emoji: '🐺', color: 'from-red-500 to-orange-500' },
        { name: 'NewJeans', emoji: '🐰', color: 'from-green-400 to-blue-400' },
        { name: 'Enhypen', emoji: '🔥', color: 'from-purple-600 to-red-600' },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2000"
                        alt="K-Pop Stage"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                    <div className="mb-6 animate-bounce">
                        <div className="inline-flex gap-3 text-4xl">
                            💜 🖤 💗 💎 🔥 ✨
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Live Your K-Pop Dreams<br />
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                            In Seoul, Korea
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                        Meet BTS ARMY locals who'll take you to HYBE, SM, YG buildings, music show tapings,
                        exclusive fan cafes, and secret K-Pop merchandise stores. Get concert tickets, photocards,
                        and make your K-Pop pilgrimage unforgettable!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/quests/create"
                            className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-bold rounded-xl text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all inline-flex items-center gap-2"
                        >
                            <Music className="w-5 h-5" />
                            Book Your K-Pop Tour Now
                        </Link>
                        <Link
                            href="#tours"
                            className="px-8 py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-xl text-lg border border-white/10 hover:bg-white/10 transition-all"
                        >
                            Explore Tours
                        </Link>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-400" />
                            Local ARMY Guides
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-purple-400" />
                            Concert Ticket Help
                        </div>
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-purple-400" />
                            Exclusive Merch Access
                        </div>
                    </div>
                </div>
            </div>

            {/* K-Pop Groups Badges */}
            <div className="py-12 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-8">
                        Tours for All Fandoms 💜
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {kpopGroups.map((group, i) => (
                            <div
                                key={i}
                                className={`px-6 py-3 bg-gradient-to-r ${group.color} rounded-full text-white font-bold text-lg hover:scale-110 transition-transform cursor-pointer shadow-lg`}
                            >
                                {group.emoji} {group.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tour Packages */}
            <div id="tours" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            K-Pop Tour Packages
                        </h2>
                        <p className="text-xl text-gray-400">
                            Curated by local K-Pop fans who know all the secret spots
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {tours.map((tour, i) => (
                            <div
                                key={i}
                                className="group p-8 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#333] rounded-2xl hover:border-purple-500 transition-all hover:shadow-xl hover:shadow-purple-500/20"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <tour.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500 mb-1">From</div>
                                        <div className="text-3xl font-bold text-purple-400">{tour.price}</div>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{tour.title}</h3>
                                <p className="text-gray-400 mb-6 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {tour.locations}
                                </p>

                                <div className="space-y-2 mb-6">
                                    {tour.highlights.map((highlight, j) => (
                                        <div key={j} className="flex items-center gap-2 text-gray-300">
                                            <Sparkles className="w-4 h-4 text-purple-400" />
                                            {highlight}
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/quests/create"
                                    className="block w-full text-center py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                                >
                                    Book This Tour
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why Book With Us */}
            <div className="py-24 px-6 bg-gradient-to-b from-transparent to-[#1A1A1A]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-12">
                        Why K-Pop Fans Love Us 💜
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-8">
                            <div className="text-5xl mb-4">🎫</div>
                            <h3 className="text-xl font-bold text-white mb-2">Concert Ticket Help</h3>
                            <p className="text-gray-400">
                                Local guides who know how to get Music Bank, Inkigayo, and concert tickets
                            </p>
                        </div>
                        <div className="p-8">
                            <div className="text-5xl mb-4">📸</div>
                            <h3 className="text-xl font-bold text-white mb-2">Perfect Photo Ops</h3>
                            <p className="text-gray-400">
                                Visit exact filming locations from your favorite MVs and dramas
                            </p>
                        </div>
                        <div className="p-8">
                            <div className="text-5xl mb-4">🛍️</div>
                            <h3 className="text-xl font-bold text-white mb-2">Merch Hunter Guides</h3>
                            <p className="text-gray-400">
                                Find rare photocards, limited albums, and exclusive pop-up stores
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-12">
                        ARMY Reviews
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    S
                                </div>
                                <div>
                                    <div className="text-white font-bold">Sarah (USA)</div>
                                    <div className="text-purple-400 text-sm">⭐⭐⭐⭐⭐</div>
                                </div>
                            </div>
                            <p className="text-gray-300 italic">
                                "My guide took me to HYBE at the perfect time and I saw RM! Also got tickets to Music Bank.
                                Best day of my life! 💜"
                            </p>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                    M
                                </div>
                                <div>
                                    <div className="text-white font-bold">Maria (Brazil)</div>
                                    <div className="text-pink-400 text-sm">⭐⭐⭐⭐⭐</div>
                                </div>
                            </div>
                            <p className="text-gray-300 italic">
                                "Found every photocard on my wishlist! The guide knew all the best shops.
                                Blackpink tour was AMAZING! 🖤💗"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 px-6 bg-gradient-to-b from-transparent to-[#0A0A0A]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Make Your K-Pop Pilgrimage Dream Come True
                    </h2>
                    <p className="text-xl text-gray-300 mb-12">
                        Connect with local ARMY, BLINK, CARAT guides who'll make your Seoul trip unforgettable!
                    </p>
                    <Link
                        href="/quests/create"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-bold rounded-xl text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
                    >
                        <Music className="w-6 h-6" />
                        Start Your K-Pop Journey
                    </Link>

                    <div className="mt-8 text-4xl">
                        💜 🖤 💗 💎 🔥 ✨
                    </div>
                </div>
            </div>
        </div>
    );
}
