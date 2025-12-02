"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function FAQPage() {
    const { language } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = language === 'ko' ? [
        {
            category: "기본 사용법",
            questions: [
                {
                    q: "K-Quest는 어떤 서비스인가요?",
                    a: "K-Quest는 한국을 방문하거나 거주하는 외국인과 한국 전문가를 연결하는 프리미엄 컨시어지 플랫폼입니다. 식당 예약, 통역, 관광 가이드, 비즈니스 지원 등 다양한 퀘스트를 의뢰하고 수행할 수 있습니다."
                },
                {
                    q: "어떻게 시작하나요?",
                    a: "1) 회원가입 (이메일 또는 소셜 로그인)\n2) 프로필 작성 (외국인 또는 전문가 선택)\n3) 퀘스트 둘러보기 또는 새 퀘스트 작성\n4) 전문가와 채팅으로 상담\n5) 안전한 결제로 퀘스트 시작!"
                },
                {
                    q: "누가 K-Quest를 사용할 수 있나요?",
                    a: "한국을 방문하거나 거주하는 모든 외국인, 그리고 영어나 다른 언어로 서비스를 제공할 수 있는 한국 전문가라면 누구나 사용할 수 있습니다. 만 18세 이상이어야 합니다."
                }
            ]
        },
        {
            category: "퀘스트 의뢰하기",
            questions: [
                {
                    q: "퀘스트는 어떻게 만드나요?",
                    a: "상단의 'Post Quest' 버튼을 클릭하여:\n1) 퀘스트 제목과 설명 작성\n2) 카테고리 선택 (식사, 사진, 교통 등)\n3) 위치와 날짜/시간 설정\n4) 예산 설정\n5) 제출하면 관리자 승인 후 게시됩니다."
                },
                {
                    q: "퀘스트 승인은 얼마나 걸리나요?",
                    a: "대부분의 퀘스트는 1-2시간 내에 승인됩니다. 복잡한 경우 최대 24시간이 걸릴 수 있습니다. 승인되면 알림을 받게 됩니다."
                },
                {
                    q: "예산은 어떻게 설정하나요?",
                    a: "비슷한 퀘스트의 평균 가격을 참고하거나, 전문가들의 제안을 받아 결정할 수 있습니다. 합리적인 예산을 설정하면 더 많은 전문가의 지원을 받을 수 있습니다."
                }
            ]
        },
        {
            category: "전문가 되기",
            questions: [
                {
                    q: "전문가로 등록하려면 어떻게 하나요?",
                    a: "회원가입 시 '전문가' 계정을 선택하고, 프로필에 자신의 전문 분야, 경력, 언어 능력을 상세히 작성하세요. 리뷰와 완료한 퀘스트가 쌓이면 신뢰도가 올라갑니다."
                },
                {
                    q: "전문가는 얼마를 벌 수 있나요?",
                    a: "퀘스트 종류와 난이도에 따라 다릅니다. 간단한 식당 예약은 $20-50, 반나절 가이드는 $100-200, 전문적인 통역은 시간당 $50-100 정도입니다. 수수료 30%가 차감됩니다."
                },
                {
                    q: "언제 돈을 받나요?",
                    a: "퀘스트 완료 후 의뢰인이 만족하면 24시간 내에 지갑에 입금됩니다. 출금은 언제든지 가능하며, 관리자 승인 후 3-5 영업일 내에 계좌로 입금됩니다."
                }
            ]
        },
        {
            category: "결제 및 환불",
            questions: [
                {
                    q: "결제는 안전한가요?",
                    a: "네! K-Quest는 PayPal과 Stripe를 통해 결제를 처리하며, 모든 결제 정보는 암호화됩니다. 또한 에스크로 시스템으로 퀘스트가 만족스럽게 완료될 때까지 결제 금액을 안전하게 보관합니다."
                },
                {
                    q: "어떤 결제 방법을 사용할 수 있나요?",
                    a: "신용카드, 직불카드, PayPal 계정을 사용할 수 있습니다. Visa, Mastercard, American Express 등 주요 카드를 모두 지원합니다."
                },
                {
                    q: "환불은 어떻게 받나요?",
                    a: "퀘스트 시작 전 취소: 100% 환불\n퀘스트 시작 후 24시간 내: 50% 환불\n전문가 귀책 사유로 미완료: 100% 환불\n환불은 3-5 영업일 내에 원래 결제 수단으로 처리됩니다."
                }
            ]
        },
        {
            category: "안전 및 신뢰",
            questions: [
                {
                    q: "사기나 부적절한 행동을 방지하나요?",
                    a: "네! 우리는 AI 기반 채팅 필터로 직거래 유도, 연락처 교환 등을 자동으로 차단합니다. 위반 시 경고가 누적되며, 3회 이상 시 계정이 정지됩니다. 또한 모든 거래는 플랫폼 내에서만 이루어져야 합니다."
                },
                {
                    q: "문제가 생기면 어떻게 하나요?",
                    a: "각 퀘스트 페이지의 '신고' 버튼을 클릭하거나, wkrwkr777@gmail.com으로 문의하세요. 관리자가 24시간 내에 검토하고 조치합니다. 심각한 위반은 즉시 계정 정지됩니다."
                },
                {
                    q: "개인정보는 안전한가요?",
                    a: "네! 우리는 개인정보처리방침에 따라 엄격하게 정보를 관리합니다. 이메일, 전화번호 등 개인정보는 암호화되어 저장되며, 제3자와 공유하지 않습니다."
                }
            ]
        },
        {
            category: "기타",
            questions: [
                {
                    q: "앱을 다운로드할 수 있나요?",
                    a: "네! Google Play Store에서 'K-Quest'를 검색하여 앱을 다운로드할 수 있습니다. 웹사이트(quest-k.com)에서도 모든 기능을 사용할 수 있습니다."
                },
                {
                    q: "고객 지원은 어떻게 받나요?",
                    a: "이메일: wkrwkr777@gmail.com\n평일 오전 9시 - 오후 6시 (한국 시간)\n응답 시간: 평균 2-4시간\n긴급한 경우 채팅으로 관리자에게 직접 연락 가능합니다."
                },
                {
                    q: "여러 언어를 지원하나요?",
                    a: "현재 한국어와 영어를 지원합니다. 상단의 언어 전환 버튼(KO/EN)으로 쉽게 변경할 수 있습니다. 향후 일본어, 중국어 등 추가 언어를 지원할 예정입니다."
                }
            ]
        }
    ] : [
        {
            category: "Getting Started",
            questions: [
                {
                    q: "What is K-Quest?",
                    a: "K-Quest is a premium concierge platform connecting foreigners visiting or living in Korea with local Korean experts. You can request and fulfill various quests such as restaurant reservations, interpretation, tour guides, business support, and more."
                },
                {
                    q: "How do I get started?",
                    a: "1) Sign up (email or social login)\n2) Complete your profile (choose foreigner or expert)\n3) Browse quests or create a new one\n4) Chat with experts for consultation\n5) Start your quest with secure payment!"
                },
                {
                    q: "Who can use K-Quest?",
                    a: "Any foreigner visiting or living in Korea, and Korean experts who can provide services in English or other languages. Users must be 18 years or older."
                }
            ]
        },
        {
            category: "Requesting Quests",
            questions: [
                {
                    q: "How do I create a quest?",
                    a: "Click the 'Post Quest' button at the top:\n1) Write quest title and description\n2) Select category (dining, photos, transport, etc.)\n3) Set location and date/time\n4) Set your budget\n5) Submit for admin approval and publication"
                },
                {
                    q: "How long does quest approval take?",
                    a: "Most quests are approved within 1-2 hours. Complex cases may take up to 24 hours. You'll receive a notification when approved."
                },
                {
                    q: "How should I set my budget?",
                    a: "Reference the average price of similar quests, or receive proposals from experts to decide. Setting a reasonable budget attracts more expert applications."
                }
            ]
        },
        {
            category: "Becoming an Expert",
            questions: [
                {
                    q: "How do I register as an expert?",
                    a: "Select 'Expert' account during sign-up, and detail your expertise, experience, and language skills in your profile. Your trust score increases as you complete quests and receive reviews."
                },
                {
                    q: "How much can experts earn?",
                    a: "Varies by quest type and difficulty. Simple restaurant reservations: $20-50, half-day tours: $100-200, professional interpretation: $50-100/hour. 30% platform fee applies."
                },
                {
                    q: "When do I get paid?",
                    a: "After quest completion and client satisfaction, payment is deposited to your wallet within 24 hours. Withdraw anytime; funds transfer to your account in 3-5 business days after admin approval."
                }
            ]
        },
        {
            category: "Payment & Refunds",
            questions: [
                {
                    q: "Is payment secure?",
                    a: "Yes! K-Quest processes payments through PayPal and Stripe, and all payment information is encrypted. Our escrow system safely holds payment until the quest is satisfactorily completed."
                },
                {
                    q: "What payment methods are accepted?",
                    a: "Credit cards, debit cards, and PayPal accounts. We support all major cards including Visa, Mastercard, and American Express."
                },
                {
                    q: "How do refunds work?",
                    a: "Cancel before quest starts: 100% refund\nWithin 24 hours after start: 50% refund\nIncomplete due to expert fault: 100% refund\nRefunds process to original payment method in 3-5 business days."
                }
            ]
        },
        {
            category: "Safety & Trust",
            questions: [
                {
                    q: "How do you prevent fraud or inappropriate behavior?",
                    a: "Our AI-powered chat filter automatically blocks direct transaction attempts and contact information exchange. Violations accumulate warnings, and 3+ violations result in account suspension. All transactions must occur within the platform."
                },
                {
                    q: "What if there's a problem?",
                    a: "Click the 'Report' button on any quest page or email wkrwkr777@gmail.com. Admins review and take action within 24 hours. Serious violations result in immediate account suspension."
                },
                {
                    q: "Is my personal information safe?",
                    a: "Yes! We strictly manage information according to our Privacy Policy. Personal information like email and phone numbers are encrypted and stored securely, never shared with third parties."
                }
            ]
        },
        {
            category: "Other",
            questions: [
                {
                    q: "Can I download the app?",
                    a: "Yes! Search for 'K-Quest' on Google Play Store to download the app. All features are also available on our website (quest-k.com)."
                },
                {
                    q: "How do I get customer support?",
                    a: "Email: wkrwkr777@gmail.com\nWeekdays 9 AM - 6 PM (Korea Time)\nAverage response: 2-4 hours\nFor urgent issues, contact admin directly via chat."
                },
                {
                    q: "Do you support multiple languages?",
                    a: "Currently supporting Korean and English. Easily switch using the language toggle button (KO/EN) at the top. Japanese, Chinese, and more languages coming soon."
                }
            ]
        }
    ];

    const filteredFAQs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(faq =>
            searchQuery === '' ||
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#050505] text-white py-32 px-6">
                <div className="container mx-auto max-w-4xl">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-light mb-4 text-white tracking-tight">
                            {language === 'ko' ? '자주 묻는 질문' : 'Frequently Asked Questions'}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {language === 'ko'
                                ? 'K-Quest에 대해 궁금한 점을 찾아보세요'
                                : 'Find answers to common questions about K-Quest'}
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mb-12 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder={language === 'ko' ? '질문 검색...' : 'Search questions...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-[#1A1A1A] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                    </div>

                    {/* FAQ Categories */}
                    <div className="space-y-8">
                        {filteredFAQs.length > 0 ? (
                            filteredFAQs.map((category, categoryIndex) => (
                                <div key={categoryIndex} className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">{category.category}</h2>
                                    <div className="space-y-4">
                                        {category.questions.map((faq, faqIndex) => {
                                            const globalIndex = categoryIndex * 100 + faqIndex;
                                            const isOpen = openIndex === globalIndex;

                                            return (
                                                <div key={faqIndex} className="border-b border-[#333] last:border-0">
                                                    <button
                                                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                                                        className="w-full py-4 flex items-center justify-between text-left group"
                                                    >
                                                        <span className="text-lg text-white group-hover:text-[#D4AF37] transition-colors pr-4">
                                                            {faq.q}
                                                        </span>
                                                        {isOpen ? (
                                                            <ChevronUp className="w-5 h-5 text-[#D4AF37] shrink-0" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                                                        )}
                                                    </button>
                                                    {isOpen && (
                                                        <div className="pb-4 text-gray-300 leading-relaxed whitespace-pre-line">
                                                            {faq.a}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                {language === 'ko'
                                    ? '검색 결과가 없습니다. 다른 검색어를 시도해보세요.'
                                    : 'No results found. Try different keywords.'}
                            </div>
                        )}
                    </div>

                    {/* Contact Section */}
                    <div className="mt-16 bg-[#1A1A1A] border border-[#333] rounded-2xl p-8 text-center">
                        <h3 className="text-2xl font-bold text-white mb-3">
                            {language === 'ko' ? '원하는 답을 찾지 못하셨나요?' : "Didn't find what you're looking for?"}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {language === 'ko'
                                ? '우리 팀이 도와드리겠습니다! 언제든지 문의해주세요.'
                                : 'Our team is here to help! Feel free to reach out.'}
                        </p>
                        <a
                            href="mailto:wkrwkr777@gmail.com"
                            className="inline-block px-8 py-3 bg-[#D4AF37] text-black font-bold rounded-none hover:bg-[#F4CF57] transition-colors uppercase tracking-widest text-sm"
                        >
                            {language === 'ko' ? '문의하기' : 'Contact Us'}
                        </a>
                    </div>

                    {/* Additional Resources */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        <Link href="/terms" className="p-6 bg-[#0A0A0A] border border-[#333] rounded-xl hover:border-[#D4AF37] transition-colors group">
                            <h4 className="text-white font-bold mb-2 group-hover:text-[#D4AF37]">
                                {language === 'ko' ? '이용약관' : 'Terms of Service'}
                            </h4>
                            <p className="text-gray-500 text-sm">
                                {language === 'ko' ? '서비스 이용 규칙 확인하기' : 'Review our service rules'}
                            </p>
                        </Link>
                        <Link href="/privacy" className="p-6 bg-[#0A0A0A] border border-[#333] rounded-xl hover:border-[#D4AF37] transition-colors group">
                            <h4 className="text-white font-bold mb-2 group-hover:text-[#D4AF37]">
                                {language === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
                            </h4>
                            <p className="text-gray-500 text-sm">
                                {language === 'ko' ? '개인정보 보호 정책 보기' : 'See how we protect your data'}
                            </p>
                        </Link>
                        <Link href="/company" className="p-6 bg-[#0A0A0A] border border-[#333] rounded-xl hover:border-[#D4AF37] transition-colors group">
                            <h4 className="text-white font-bold mb-2 group-hover:text-[#D4AF37]">
                                {language === 'ko' ? 'K-Quest 소개' : 'About K-Quest'}
                            </h4>
                            <p className="text-gray-500 text-sm">
                                {language === 'ko' ? '우리의 이야기 알아보기' : 'Learn about our story'}
                            </p>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
