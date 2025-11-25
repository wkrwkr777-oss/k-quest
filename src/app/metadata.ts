import { Metadata } from 'next';

// 홈페이지 최적화된 메타데이터
export const metadata: Metadata = {
    // 기본 SEO
    title: 'K-Quest - Premium Korean Concierge Service for Foreigners | Korea Travel Help',
    description: 'Connect with verified Korean locals for restaurant reservations, cultural tours, shopping help, and exclusive experiences. Your premium quest-based concierge service in Korea.',

    // 키워드 (외국인들이 많이 검색하는 키워드)
    keywords: [
        // 핵심 키워드
        'Korea travel help',
        'Korean concierge service',
        'foreigner in Korea',
        'Korea travel guide',
        'Korean local guide',

        // 서비스 관련
        'Korea restaurant reservation',
        'Seoul restaurant booking',
        'Korean food guide',
        'Korea shopping help',
        'Korea cultural tour',
        'Korea photo session',
        'Korea VIP service',

        // 위치 기반
        'Seoul travel guide',
        'Busan travel help',
        'Jeju travel service',
        'Korea travel assistance',

        // 타겟 키워드
        'help in Korea',
        'Korean friend service',
        'local Korean helper',
        'Korea quest service',
        'expat in Korea',
        'foreigner help Korea',

        // 긴꼬리 키워드
        'how to book Korean restaurant as foreigner',
        'Korean local expert service',
        'premium Korea travel concierge',
        'verified Korean locals',
        'Korea travel companion',
        'English speaking Korean guide',
    ].join(', '),

    // Open Graph (소셜 미디어)
    openGraph: {
        type: 'website',
        locale: 'en_US',
        alternateLocale: ['ko_KR'],
        url: 'https://quest-k.com',
        siteName: 'K-Quest',
        title: 'K-Quest - Your Premium Korean Adventure Companion',
        description: 'Connect with verified Korean locals for exclusive experiences. Restaurant reservations, cultural tours, shopping assistance & more. Trusted by foreigners worldwide.',
        images: [
            {
                url: 'https://quest-k.com/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'K-Quest - Premium Korean Concierge Service',
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        site: '@kquest',
        creator: '@kquest',
        title: 'K-Quest - Premium Korean Concierge Service',
        description: 'Your trusted companion for Korean adventures. Connect with verified locals for exclusive experiences.',
        images: ['https://quest-k.com/og-image.jpg'],
    },

    // 추가 메타 태그
    other: {
        // 지리적 타겟팅
        'geo.region': 'KR',
        'geo.placename': 'Seoul, South Korea',
        'geo.position': '37.5665;126.9780',
        'ICBM': '37.5665, 126.9780',

        // 모바일 최적화
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',

        // 외국인 커뮤니티 타겟
        'target-audience': 'foreigners in Korea, Korea travelers, expats in Korea',
        'audience': 'international',
    },

    // 추가 링크
    alternates: {
        canonical: 'https://quest-k.com',
        languages: {
            'en-US': 'https://quest-k.com/en',
            'ko-KR': 'https://quest-k.com/ko',
        },
    },

    // 로봇 설정
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // 검증
    verification: {
        google: 'YOUR_GOOGLE_VERIFICATION_CODE',
        yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
    },
};
