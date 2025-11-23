import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SITE_PASSWORD = 'kquest2024secret';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (password === SITE_PASSWORD) {
            const response = NextResponse.json({ success: true });

            // 쿠키 설정 (7일 유효)
            response.cookies.set('site-auth', SITE_PASSWORD, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7일
                path: '/',
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: '비밀번호가 틀렸습니다.' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: '오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
