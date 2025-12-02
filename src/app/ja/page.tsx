import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ソウル美容整形 VIPコンシェルジュ | K-Quest高級医療ツーリズム',
    description: '韓国最高の美容整形コンシェルジュサービス。VIP医療ツーリズム、プライベートショッピング、ミシュランレストラン予約。グローバルエリート向けホワイトグローブサービス。',
    keywords: 'ソウル美容整形, 韓国医療ツーリズム, VIPコンシェルジュ韓国, 韓国高級旅行, ソウルパーソナルアシスタント, K-POP VIP体験, ソウルショッピング, 韓国ビジネスアシスタント',
    alternates: {
        canonical: 'https://quest-k.com/ja',
    },
};

export default function JapaneseVIPPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-bold text-white mb-6">
                    ソウルVIPコンシェルジュサービス
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    グローバルエリートのためのホワイトグローブサービス
                </p>
                <div className="bg-gradient-to-br from-[#D4AF37]/10 to-purple-500/10 border border-[#D4AF37]/20 rounded-2xl p-12">
                    <h2 className="text-3xl font-bold text-white mb-6">VIPサービス内容</h2>
                    <ul className="text-left space-y-4 text-gray-300 text-lg">
                        <li>✨ <strong className="text-[#D4AF37]">トップクラス美容整形クリニック</strong> - 最高の美容外科医への専用アクセス</li>
                        <li>✨ <strong className="text-[#D4AF37]">高級ブランドショッピング</strong> - シャネル、エルメスVIPショッピング体験</li>
                        <li>✨ <strong className="text-[#D4AF37]">ミシュランレストラン予約</strong> - 予約困難な高級レストラン優先予約</li>
                        <li>✨ <strong className="text-[#D4AF37]">K-POPバックステージアクセス</strong> - 限定ファンミーティングとバックステージ体験</li>
                        <li>✨ <strong className="text-[#D4AF37]">専属通訳</strong> - 医療専門通訳とビジネスアシスタント</li>
                        <li>✨ <strong className="text-[#D4AF37]">24時間コンシェルジュ</strong> - 24時間365日対応のホワイトグローブサービス</li>
                    </ul>
                    <div className="mt-12">
                        <a
                            href="/quests/create"
                            className="inline-block px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-xl text-xl hover:shadow-2xl transition-all"
                        >
                            今すぐVIPサービスを予約
                        </a>
                    </div>
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl">
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">$100万+</div>
                        <div className="text-gray-400">平均顧客純資産</div>
                    </div>
                    <div className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl">
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">98%</div>
                        <div className="text-gray-400">顧客満足度</div>
                    </div>
                    <div className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl">
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">50+</div>
                        <div className="text-gray-400">サービス提供国</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
