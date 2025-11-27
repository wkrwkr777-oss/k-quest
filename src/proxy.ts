import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🔒 긴급 비공개 모드 - 전체 사이트 차단!
const SITE_PASSWORD = 'kquest2024secret';
const MAINTENANCE_MODE = true; // true = 비공개

export default function proxy(request: NextRequest) {
    // 강제 비공개 모드
    if (!MAINTENANCE_MODE) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    // API와 정적 파일만 통과
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // 쿠키 확인
    const authCookie = request.cookies.get('site-auth');

    if (authCookie?.value === SITE_PASSWORD) {
        return NextResponse.next();
    }

    // 비밀번호 페이지로 강제 리다이렉트
    if (pathname !== '/auth-check') {
        const url = request.nextUrl.clone();
        url.pathname = '/auth-check';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
    ],
};
