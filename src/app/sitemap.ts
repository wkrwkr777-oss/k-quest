import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://quest-k.com';

    // 기본 페이지
    const routes = [
        '',
        '/vip-concierge',
        '/quests',
        '/quests/new',
        '/company',
        '/wallet',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' || route === '/vip-concierge' ? 1.0 : 0.8,
    }));

    // 블로그 페이지 (SEO 트래픽 유입용)
    const blogPosts = [
        '/blog/korea-travel-guide',
        '/kpop-tour',
        '/blog/best-korean-bbq-seoul',
        '/blog/kpop-tour-experience',
        '/blog/seoul-shopping-guide',
        '/blog/korean-street-food',
        '/blog/busan-travel-guide',
        '/blog/jeju-island-tips',
    ].map((post) => ({
        url: `${baseUrl}${post}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: post === '/kpop-tour' ? 0.9 : 0.8,
    }));

    // 위치 페이지
    const locations = [
        '/seoul',
        '/busan',
        '/jeju',
        '/gangnam',
        '/hongdae',
        '/itaewon',
    ].map((location) => ({
        url: `${baseUrl}${location}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...blogPosts, ...locations];
}
