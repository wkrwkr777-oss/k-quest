import { Metadata } from 'next';
import Link from 'next/link';
import { Crown, Shield, Star, Sparkles, Globe, Award } from 'lucide-react';

export const metadata: Metadata = {
    title: 'VIP Concierge Service Korea | Luxury Personal Assistant Seoul',
    description: 'Exclusive VIP concierge service for high-net-worth individuals. Private shopping, luxury dining, business support, medical tourism coordination in Seoul, Korea.',
    keywords: 'VIP concierge Korea, luxury concierge Seoul, personal assistant Korea, high-net-worth services, luxury travel Korea, private guide Seoul, executive assistant Korea, billionaire services Asia',
    openGraph: {
        title: 'VIP Concierge Service Korea | Ultra-Premium',
        description: 'White-glove service for discerning global clientele',
        images: [{ url: '/vip-concierge.jpg', width: 1200, height: 630 }],
    },
};

export default function VIPConciergePage() {
    const services = [
        {
            icon: Crown,
            title: 'Ultra-Premium Shopping',
            description: 'Private access to Chanel, Hermès, and exclusive Korean luxury brands',
        },
        {
            icon: Star,
            title: 'Michelin Dining Reservations',
            description: 'Priority seating at impossible-to-book restaurants',
        },
        {
            icon: Shield,
            title: 'Medical Tourism Concierge',
            description: 'Top-tier plastic surgery clinics with VIP care coordination',
        },
        {
            icon: Globe,
            title: 'Business & Translation',
            description: 'Executive assistant services for international business',
        },
        {
            icon: Award,
            title: 'K-Pop VIP Experiences',
            description: 'Backstage access, private fan meetings, exclusive merchandise',
        },
        {
            icon: Sparkles,
            title: 'Private K-Drama Tours',
            description: 'Customized tours of filming locations with celebrity insights',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=2000"
                        alt="Luxury Seoul"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <div className="mb-6 inline-block">
                        <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] rounded-full">
                            <Crown className="w-6 h-6 text-black" />
                            <span className="text-black font-bold text-lg">ULTRA-PREMIUM VIP SERVICE</span>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        White-Glove Concierge<br />
                        <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                            For Global Elite
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                        Discreet, professional concierge services designed exclusively for
                        high-net-worth individuals, celebrities, and business executives visiting Korea.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/quests/create"
                            className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-bold rounded-xl text-lg hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all inline-flex items-center gap-2"
                        >
                            <Crown className="w-5 h-5" />
                            Request VIP Service
                        </Link>
                        <Link
                            href="#services"
                            className="px-8 py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-xl text-lg border border-white/10 hover:bg-white/10 transition-all"
                        >
                            Explore Services
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#D4AF37]" />
                            100% Confidential
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#D4AF37]" />
                            Available 24/7
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#D4AF37]" />
                            Verified Professionals
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div id="services" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Exclusive VIP Services
                        </h2>
                        <p className="text-xl text-gray-400">
                            Tailored experiences for the world's most discerning clientele
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, i) => (
                            <div
                                key={i}
                                className="group p-8 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#333] rounded-2xl hover:border-[#D4AF37] transition-all hover:shadow-xl hover:shadow-[#D4AF37]/10"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <service.icon className="w-8 h-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Luxury Stats */}
            <div className="py-24 px-6 bg-gradient-to-b from-transparent to-[#1A1A1A]/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div className="p-8">
                            <div className="text-5xl font-bold text-[#D4AF37] mb-2">$1M+</div>
                            <div className="text-gray-400">Average Client Net Worth</div>
                        </div>
                        <div className="p-8">
                            <div className="text-5xl font-bold text-[#D4AF37] mb-2">98%</div>
                            <div className="text-gray-400">Client Satisfaction Rate</div>
                        </div>
                        <div className="p-8">
                            <div className="text-5xl font-bold text-[#D4AF37] mb-2">24/7</div>
                            <div className="text-gray-400">Concierge Availability</div>
                        </div>
                        <div className="p-8">
                            <div className="text-5xl font-bold text-[#D4AF37] mb-2">50+</div>
                            <div className="text-gray-400">Countries Served</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Tourism Section */}
            <div className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-purple-500/10 to-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-3xl p-12">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            World-Class Medical Tourism Concierge
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Korea is the global leader in cosmetic surgery and advanced medical procedures.
                            We coordinate everything from initial consultation to post-operative care, ensuring
                            a seamless, private, and comfortable experience.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-black font-bold">✓</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Top-Tier Clinics</h4>
                                    <p className="text-gray-400 text-sm">Access to Seoul's most renowned plastic surgeons</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-black font-bold">✓</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">VIP Recovery Suite</h4>
                                    <p className="text-gray-400 text-sm">Private recovery accommodations with nursing care</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-black font-bold">✓</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Medical Translation</h4>
                                    <p className="text-gray-400 text-sm">Professional medical interpreters at every appointment</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-black font-bold">✓</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Complete Privacy</h4>
                                    <p className="text-gray-400 text-sm">Discreet service with strict confidentiality</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/quests/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all"
                        >
                            Inquire About Medical Services
                            <Crown className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 px-6 bg-gradient-to-b from-transparent to-[#0A0A0A]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Experience Korea Like Royalty
                    </h2>
                    <p className="text-xl text-gray-300 mb-12">
                        Whether you're here for business, pleasure, or medical care, our VIP concierge
                        team ensures every detail exceeds your expectations.
                    </p>
                    <Link
                        href="/quests/create"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-xl text-xl hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all"
                    >
                        <Crown className="w-6 h-6" />
                        Request Your Personal Concierge
                    </Link>
                </div>
            </div>
        </div>
    );
}
