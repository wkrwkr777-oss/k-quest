import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '首尔整形手术 VIP礼宾服务 | K-Quest豪华医疗旅游',
    description: '韩国最佳整形手术礼宾服务。VIP医疗旅游、私人购物、米其林餐厅预订。为全球精英客户提供白手套服务。',
    keywords: '首尔整形手术, 韩国医疗旅游, VIP礼宾服务韩国, 韩国奢华旅游, 首尔私人助理, K-POP VIP体验, 首尔购物指南, 韩国商务助理',
    alternates: {
        canonical: 'https://quest-k.com/zh',
    },
};

export default function ChineseVIPPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-bold text-white mb-6">
                    首尔VIP礼宾服务
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    专为全球精英打造的白手套服务
                </p>
                <div className="bg-gradient-to-br from-[#D4AF37]/10 to-purple-500/10 border border-[#D4AF37]/20 rounded-2xl p-12">
                    <h2 className="text-3xl font-bold text-white mb-6">我们的VIP服务</h2>
                    <ul className="text-left space-y-4 text-gray-300 text-lg">
                        <li>✨ <strong className="text-[#D4AF37]">顶级整形外科医院</strong> - 最佳整形外科医生专属通道</li>
                        <li>✨ <strong className="text-[#D4AF37]">奢侈品购物</strong> - Chanel、Hermès VIP专属购物体验</li>
                        <li>✨ <strong className="text-[#D4AF37]">米其林餐厅预订</strong> - 优先预订一位难求的顶级餐厅</li>
                        <li>✨ <strong className="text-[#D4AF37]">K-POP后台访问</strong> - 独家粉丝见面会和后台体验</li>
                        <li>✨ <strong className="text-[#D4AF37]">私人翻译</strong> - 专业医疗翻译和商务助理</li>
                        <li>✨ <strong className="text-[#D4AF37]">24/7礼宾服务</strong> - 全天候白手套服务</li>
                    </ul>
                    <div className="mt-12">
                        <a
                            href="/quests/create"
                            className="inline-block px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-xl text-xl hover:shadow-2xl transition-all"
                        >
                            立即预订VIP服务
                        </a>
                    </div>
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl">
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">$100万+</div>
                        <div className="text-gray-400">平均客户净资产</div>
                    </div>
                    <div className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl">
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">98%</div>
                        <div className="text-gray-400">客户满意度</div>
                    </div>
                    <div className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl">
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">50+</div>
                        <div className="text-gray-400">服务国家</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
