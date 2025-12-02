'use client'

import Link from 'next/link'

export default function PerformerLandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 text-white py-24">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-600/30 border border-blue-400 text-blue-300 text-sm font-bold mb-6 animate-fade-in-up">
                        K-Quest Elite Agent Program
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        당신의 지식으로<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            한국을 대표하세요
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        단순한 알바가 아닙니다. 전 세계인에게 한국의 매력을 전하는
                        <strong> 민간 외교관</strong>이 되어주세요.<br />
                        그리고 당신의 가치에 걸맞은 <strong>달러($) 수익</strong>을 창출하세요.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/verify-expert" className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-xl">
                            전문가 인증하고 시작하기
                        </Link>
                        <Link href="/quests" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                            진행 중인 의뢰 보기
                        </Link>
                    </div>
                </div>
            </div>

            {/* Why Join Section */}
            <div className="py-20 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        왜 상위 1% 인재들이 K-Quest를 선택할까요?
                    </h2>
                    <p className="text-gray-500">우리는 당신의 전문성을 존중하고, 그에 합당한 대우를 약속합니다.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: '💎',
                            title: '압도적인 수익',
                            desc: '단순 노동이 아닌 지식 기반 서비스로, 시급 5만원 이상의 고수익 퀘스트가 다수 존재합니다.'
                        },
                        {
                            icon: '🌍',
                            title: '글로벌 네트워킹',
                            desc: '미국, 유럽, 일본 등 전 세계 클라이언트와 소통하며 글로벌 감각과 언어 능력을 키우세요.'
                        },
                        {
                            icon: '🏅',
                            title: '퍼스널 브랜딩',
                            desc: '우수 수행자로 선정되면 [Hall of Fame]에 등재되어 당신의 커리어에 강력한 포트폴리오가 됩니다.'
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Target Audience */}
            <div className="bg-slate-50 dark:bg-slate-900/50 py-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                이런 분들을 찾습니다
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    '🎓 서울 소재 명문대 재학생 (언어 교환/캠퍼스 투어)',
                                    '💼 전문 지식을 갖춘 직장인 (비즈니스 통역/시장 조사)',
                                    '📸 감각 있는 로컬 크리에이터 (핫플 가이드/스냅 촬영)',
                                    '🛍️ 트렌드에 민감한 쇼퍼 (한정판 굿즈/패션 소싱)'
                                ].map((text, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300">
                                        <span className="text-green-500">✔</span> {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">💬</div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">실제 수행자 후기</p>
                                    <p className="text-sm text-gray-500">김OO님 (연세대 재학)</p>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 italic">
                                "처음엔 용돈 벌이로 시작했는데, 지금은 외국인 친구들도 많이 사귀고 영어 실력도 늘었어요.
                                무엇보다 제가 아는 서울의 맛집을 소개해주고 고맙다는 말을 들을 때 정말 뿌듯합니다."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    지금 바로 K-Quest의 엘리트가 되세요
                </h2>
                <Link href="/verify-expert" className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
                    전문가 인증 신청하기 🚀
                </Link>
                <p className="mt-4 text-sm text-gray-500">
                    * 인증은 무료이며, 승인 시 [Verified Pro] 배지가 즉시 지급됩니다.
                </p>
            </div>
        </div>
    )
}
