import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');

    // TODO: PASS API 실제 연동 (키 발급 후)
    const PASS_CLIENT_ID = process.env.PASS_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
    const PASS_CLIENT_SECRET = process.env.PASS_CLIENT_SECRET || 'YOUR_SECRET_HERE';

    if (!code) {
        return new NextResponse(`
            <script>
                window.opener.postMessage({
                    type: 'PASS_ERROR',
                    message: '인증 코드가 없습니다.'
                }, '*');
                window.close();
            </script>
        `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    try {
        // 1. 인증 코드로 액세스 토큰 받기
        const tokenRes = await fetch('https://api.skt-id.co.kr/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                code: code,
                client_id: PASS_CLIENT_ID,
                client_secret: PASS_CLIENT_SECRET,
            })
        });

        if (!tokenRes.ok) throw new Error('토큰 발급 실패');

        const { access_token } = await tokenRes.json();

        // 2. 사용자 정보 조회
        const userRes = await fetch('https://api.skt-id.co.kr/user/me', {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (!userRes.ok) throw new Error('사용자 정보 조회 실패');

        const userData = await userRes.json();

        // 3. 나이 계산 (주민번호 앞자리 사용)
        const birthYear = parseInt(userData.birthdate.substring(0, 4));
        const age = new Date().getFullYear() - birthYear;

        if (age < 18) {
            return new NextResponse(`
                <script>
                    window.opener.postMessage({
                        type: 'PASS_ERROR',
                        message: '만 18세 이상만 가입 가능합니다.'
                    }, '*');
                    window.close();
                </script>
            `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }

        // 4. 부모 창에 결과 전달
        return new NextResponse(`
            <script>
                window.opener.postMessage({
                    type: 'PASS_VERIFIED',
                    name: '${userData.name}',
                    birthdate: '${userData.birthdate}',
                    phoneNumber: '${userData.phone_number}'
                }, '*');
                window.close();
            </script>
        `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

    } catch (error: any) {
        return new NextResponse(`
            <script>
                window.opener.postMessage({
                    type: 'PASS_ERROR',
                    message: '인증 중 오류가 발생했습니다: ${error.message}'
                }, '*');
                window.close();
            </script>
        `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
}
