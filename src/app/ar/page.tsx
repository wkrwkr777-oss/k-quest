import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'خدمة الكونسيرج الفاخرة في سيول | K-Quest السياحة الطبية الفاخرة',
    description: 'أفضل خدمة كونسيرج للجراحة التجميلية في كوريا. السياحة الطبية الفاخرة، التسوق الخاص، حجوزات مطاعم ميشلان. خدمة القفازات البيضاء للنخبة العالمية.',
    keywords: 'الجراحة التجميلية في سيول, السياحة الطبية في كوريا, خدمة كونسيرج كوريا, السفر الفاخر كوريا, مساعد شخصي سيول, تجربة K-POP VIP',
    alternates: {
        canonical: 'https://quest-k.com/ar',
    },
};

export default function ArabicVIPPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] py-24 px-6" dir="rtl">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-bold text-white mb-6">
                    خدمة الكونسيرج الفاخرة في سيول
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    خدمة القفازات البيضاء للنخبة العالمية
                </p>
                <div className="bg-gradient-to-br from-[#D4AF37]/10 to-purple-500/10 border border-[#D4AF37]/20 rounded-2xl p-12">
                    <h2 className="text-3xl font-bold text-white mb-6">خدماتنا الفاخرة</h2>
                    <ul className="text-right space-y-4 text-gray-300 text-lg">
                        <li>✨ <strong className="text-[#D4AF37]">أفضل عيادات الجراحة التجميلية</strong> - وصول حصري لأفضل جراحي التجميل</li>
                        <li>✨ <strong className="text-[#D4AF37]">تسوق العلامات الفاخرة</strong> - تجربة تسوق VIP في شانيل وهيرميس</li>
                        <li>✨ <strong className="text-[#D4AF37]">حجوزات مطاعم ميشلان</strong> - أولوية الحجز في أرقى المطاعم</li>
                        <li>✨ <strong className="text-[#D4AF37]">وصول حصري لـ K-POP</strong> - لقاءات معجبين حصرية وزيارات خلف الكواليس</li>
                        <li>✨ <strong className="text-[#D4AF37]">مترجم خاص</strong> - مترجم طبي متخصص ومساعد أعمال</li>
                        <li>✨ <strong className="text-[#D4AF37]">خدمة كونسيرج 24/7</strong> - خدمة على مدار الساعة</li>
                    </ul>
                    <div className="mt-12">
                        <a
                            href="/quests/create"
                            className="inline-block px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-xl text-xl hover:shadow-2xl transition-all"
                        >
                            احجز خدمة VIP الآن
                        </a>
                    </div>
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl">
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">$1 مليون+</div>
                        <div className="text-gray-400">متوسط ثروة العملاء</div>
                    </div>
                    <div className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl">
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">%98</div>
                        <div className="text-gray-400">رضا العملاء</div>
                    </div>
                    <div className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl">
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">+50</div>
                        <div className="text-gray-400">دول مخدومة</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
