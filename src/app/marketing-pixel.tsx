"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 🦊 FOX MARKETING ENGINE
 * 이 컴포넌트는 방문자의 모든 행동을 추적하고 광고 플랫폼에 자동 전송합니다.
 */

// Facebook Pixel 추적
declare global {
    interface Window {
        fbq?: (track: string, event: string, data?: any) => void;
        gtag?: (...args: any[]) => void;
    }
}

export function MarketingPixel() {
    const pathname = usePathname();

    useEffect(() => {
        // 페이지 뷰 추적 (모든 페이지 전환 시)
        trackPageView(pathname);
    }, [pathname]);

    return null; // UI 없음, 백그라운드에서만 작동
}

// 페이지 뷰 추적
function trackPageView(path: string) {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
            page_path: path,
        });
    }

    // Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
    }
}

// 회원가입 추적 (성공 시 호출)
export function trackSignup(userId: string, email: string) {
    if (typeof window === 'undefined') return;

    // Facebook Pixel
    window.fbq?.('track', 'CompleteRegistration', {
        value: 10.0, // 회원가입 가치 = $10
        currency: 'USD',
    });

    // Google Conversion
    window.gtag?.('event', 'sign_up', {
        method: 'Email',
        value: 10,
    });

    console.log('✅ Signup tracked:', email);
}

// 퀘스트 등록 추적
export function trackQuestCreated(questId: string, amount: number) {
    if (typeof window === 'undefined') return;

    // Facebook Pixel
    window.fbq?.('track', 'AddToCart', {
        content_ids: [questId],
        content_type: 'quest',
        value: amount,
        currency: 'USD',
    });

    // Google Conversion
    window.gtag?.('event', 'add_to_cart', {
        currency: 'USD',
        value: amount,
        items: [
            {
                item_id: questId,
                item_name: 'Quest Creation',
                price: amount,
            },
        ],
    });

    console.log('✅ Quest creation tracked:', questId, amount);
}

// 결제 완료 추적 (가장 중요!)
export function trackPurchase(orderId: string, amount: number, questId: string) {
    if (typeof window === 'undefined') return;

    // Facebook Pixel
    window.fbq?.('track', 'Purchase', {
        value: amount,
        currency: 'USD',
        content_ids: [questId],
        content_type: 'quest',
    });

    // Google Conversion
    window.gtag?.('event', 'purchase', {
        transaction_id: orderId,
        value: amount,
        currency: 'USD',
        items: [
            {
                item_id: questId,
                item_name: 'Quest Payment',
                price: amount,
            },
        ],
    });

    console.log('🎉 Purchase tracked:', orderId, amount);
}

// 검색 추적
export function trackSearch(query: string) {
    if (typeof window === 'undefined') return;

    window.fbq?.('track', 'Search', {
        search_string: query,
    });

    window.gtag?.('event', 'search', {
        search_term: query,
    });
}

// 공유 버튼 클릭 추적
export function trackShare(questId: string, method: string) {
    if (typeof window === 'undefined') return;

    window.gtag?.('event', 'share', {
        method: method,
        content_type: 'quest',
        content_id: questId,
    });

    console.log('📤 Share tracked:', questId, method);
}
