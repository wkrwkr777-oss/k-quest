import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://quest-k.com';

    // 기본 페이지
    const routes = [
        '',
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
        priority: route === '' ? 1.0 : 0.8,
    }));

    // 블로그 페이지 (추가 예정)
    const blogPosts = [
        '/blog/book-seoul-restaurants',
        '/blog/authentic-korean-experiences',
        '/blog/korean-shopping-guide',
        '/blog/seoul-nightlife-guide',
    ].map((post) => ({
        url: `${baseUrl}${post}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
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
