/**
 * K-Quest SEO 자동화 유틸리티
 * 모든 퀘스트를 구글 검색엔진이 좋아하는 구조화된 데이터(JSON-LD)로 변환합니다.
 */

export function generateQuestJsonLd(quest: {
    id: string
    title: string
    description: string
    reward: number
    created_at: string
    category: string
    location?: string
}) {
    // Google Rich Snippets (JobPosting or Service) 형식
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Service",
        "serviceType": quest.category,
        "name": quest.title,
        "description": quest.description,
        "provider": {
            "@type": "Organization",
            "name": "K-Quest Platform"
        },
        "areaServed": {
            "@type": "Country",
            "name": "South Korea"
        },
        "offers": {
            "@type": "Offer",
            "price": quest.reward,
            "priceCurrency": "KRW",
            "availability": "https://schema.org/InStock"
        },
        "datePosted": quest.created_at,
        "url": `https://k-quest.com/quests/${quest.id}`
    }

    return JSON.stringify(jsonLd)
}

export function generateMetaTags(quest: { title: string, description: string, image?: string, reward: number }) {
    return {
        title: `${quest.title} | K-Quest Korea`,
        description: quest.description.substring(0, 160),
        openGraph: {
            title: `Mission: ${quest.title}`,
            description: "Can you complete this mission in Korea? Apply now!",
            images: [quest.image || '/images/default-quest-og.png'],
            type: 'website',
            siteName: 'K-Quest',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Wanted: Agent for ${quest.title}`,
            description: `Reward: ₩${quest.reward} KRW. Help needed in Korea!`,
            images: [quest.image || '/images/default-quest-og.png'],
        }
    }
}
