import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Star, Coffee, Camera } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Ultimate Korea Travel Guide 2025 | K-Quest Insider Tips',
    description: 'Discover the best places to visit in Korea, from hidden cafes in Seoul to K-Pop tour experiences. Expert local guide recommendations.',
    keywords: 'Korea travel guide, Seoul travel, Busan travel, K-Pop tour, Korean food, best places in Korea',
    openGraph: {
        title: 'Ultimate Korea Travel Guide 2025',
        description: 'Expert local insights for your perfect Korea adventure',
        images: [{ url: '/blog/korea-travel.jpg', width: 1200, height: 630 }],
    },
};

export default function KoreaTravelGuidePage() {
    const highlights = [
        { icon: Coffee, title: 'Hidden Cafes', description: 'Instagram-worthy spots locals love' },
        { icon: Camera, title: 'K-Drama Locations', description: 'Visit your favorite drama filming sites' },
        { icon: MapPin, title: 'Night Markets', description: 'Best street food experiences' },
        { icon: Star, title: 'VIP K-Pop Tours', description: 'Exclusive behind-the-scenes access' },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-12 px-6">
            <article className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <div className="mb-4">
                        <span className="px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full">
                            TRAVEL GUIDE
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Ultimate Korea Travel Guide 2025
                    </h1>
                    <p className="text-xl text-gray-400">
                        Discover Seoul, Busan, and Jeju like a local with our expert insider tips
                    </p>
                    <div className="mt-6 text-sm text-gray-500">
                        Last updated: {new Date().toLocaleDateString()}
                    </div>
                </header>

                <div className="prose prose-invert max-w-none">
                    <img
                        src="https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=1200"
                        alt="Seoul Skyline"
                        className="w-full h-96 object-cover rounded-2xl mb-8"
                    />

                    <h2 className="text-3xl font-bold text-white mt-12 mb-6">
                        Why Korea Should Be Your Next Destination
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Korea has become one of the hottest travel destinations in the world, thanks to the global K-Pop phenomenon,
                        mouth-watering Korean cuisine, and a perfect blend of ancient culture and cutting-edge technology.
                        Whether you're a BTS fan, foodie, or history buff, Korea has something magical for everyone.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 my-12">
                        {highlights.map((item, i) => (
                            <div key={i} className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6">
                                <item.icon className="w-8 h-8 text-[#D4AF37] mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold text-white mt-12 mb-6">
                        Top 10 Must-Visit Places in Seoul
                    </h2>
                    <ol className="list-decimal list-inside space-y-4 text-gray-300">
                        <li><strong className="text-white">Gangnam District</strong> - Experience the modern, luxurious side of Seoul</li>
                        <li><strong className="text-white">Hongdae</strong> - Youth culture, indie music, and street performances</li>
                        <li><strong className="text-white">Myeongdong</strong> - Shopping paradise and street food heaven</li>
                        <li><strong className="text-white">Bukchon Hanok Village</strong> - Traditional Korean houses and culture</li>
                        <li><strong className="text-white">N Seoul Tower</strong> - Panoramic city views and love locks</li>
                        <li><strong className="text-white">Insadong</strong> - Traditional crafts and tea houses</li>
                        <li><strong className="text-white">Dongdaemun Design Plaza</strong> - Futuristic architecture and night markets</li>
                        <li><strong className="text-white">Itaewon</strong> - International district with diverse cuisine</li>
                        <li><strong className="text-white">Lotte World</strong> - Indoor theme park adventure</li>
                        <li><strong className="text-white">Han River Parks</strong> - Riverside picnics and night cycling</li>
                    </ol>

                    <h2 className="text-3xl font-bold text-white mt-12 mb-6">
                        K-Pop Experience: Beyond the Music
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Korea is the birthplace of K-Pop, and fans from around the world flock here to experience it firsthand.
                        Visit entertainment company buildings, attend live music shows, explore K-Pop themed cafes, and even
                        record your own K-Pop experience at specialized studios.
                    </p>

                    <div className="bg-gradient-to-br from-[#D4AF37]/10 to-purple-500/10 border border-[#D4AF37]/20 rounded-2xl p-8 my-12">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            🎤 Get Your Personal K-Pop Tour Guide
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Connect with verified local experts who can take you to exclusive K-Pop locations,
                            hidden gems, and provide insider access that regular tours can't offer.
                        </p>
                        <Link
                            href="/quests"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all"
                        >
                            Find Your Guide
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <h2 className="text-3xl font-bold text-white mt-12 mb-6">
                        Korean Food: A Culinary Adventure
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Korean cuisine is taking the world by storm. From sizzling Korean BBQ to spicy kimchi, comforting
                        bibimbap to trendy Korean fried chicken, your taste buds are in for an unforgettable journey.
                    </p>

                    <h3 className="text-2xl font-bold text-white mt-8 mb-4">Must-Try Korean Dishes:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                        <li>Korean BBQ (삼겹살 Samgyeopsal)</li>
                        <li>Bibimbap (비빔밥) - Mixed rice bowl</li>
                        <li>Kimchi Jjigae (김치찌개) - Kimchi stew</li>
                        <li>Tteokbokki (떡볶이) - Spicy rice cakes</li>
                        <li>Korean Fried Chicken (치킨)</li>
                        <li>Japchae (잡채) - Glass noodles</li>
                    </ul>

                    <h2 className="text-3xl font-bold text-white mt-12 mb-6">
                        Practical Tips for First-Time Visitors
                    </h2>
                    <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 mb-8">
                        <ul className="space-y-3 text-gray-300">
                            <li>✅ <strong className="text-white">Transportation:</strong> Get a T-Money card for subway and buses</li>
                            <li>✅ <strong className="text-white">Language:</strong> Download Papago translator app</li>
                            <li>✅ <strong className="text-white">Cash:</strong> Some small shops still prefer cash</li>
                            <li>✅ <strong className="text-white">Tipping:</strong> Not expected in Korea</li>
                            <li>✅ <strong className="text-white">Best Time:</strong> Spring (April-May) or Autumn (September-October)</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/10 to-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl p-8 mt-12">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Ready to Experience Korea?
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Don't just visit Korea - experience it like a VIP. Connect with local experts on K-Quest
                            who can create personalized experiences just for you.
                        </p>
                        <Link
                            href="/quests/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all"
                        >
                            Post Your Quest
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
