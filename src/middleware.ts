import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🔒 비밀번호 보호 - 사이트 전체 비공개!
const SITE_PASSWORD = 'kquest2024secret';
const MAINTENANCE_MODE = true; // true = 비공개, false = 공개

export function middleware(request: NextRequest) {
    // 유지보수 모드 비활성화 시 정상 접근
    if (!MAINTENANCE_MODE) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    // 정적 파일은 통과
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // 쿠키에서 인증 확인
    const authCookie = request.cookies.get('site-auth');

    if (authCookie?.value === SITE_PASSWORD) {
        return NextResponse.next();
    }

    // 비밀번호 입력 페이지로 리다이렉트
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
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
