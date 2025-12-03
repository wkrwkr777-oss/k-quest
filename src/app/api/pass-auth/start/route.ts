import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // TODO: PASS API 키 발급 후 여기에 입력
    const PASS_CLIENT_ID = process.env.PASS_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (PASS_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
        return new NextResponse(`
            <html>
                <body style="background: #000; color: #fff; font-family: sans-serif; padding: 40px; text-align: center;">
                    <h1>⚠️ PASS 인증 설정 필요</h1>
                    <p>PASS API 키를 아직 발급받지 않으셨습니다.</p>
                    <p>아래 단계를 따라 설정해주세요:</p>
                    <ol style="text-align: left; max-width: 600px; margin: 20px auto; line-height: 2;">
                        <li><a href="https://www.skt-id.co.kr" target="_blank" style="color: #00C73C;">PASS 개발자 센터</a> 접속</li>
                        <li>회원가입 및 앱 등록</li>
                        <li>API 키 발급 받기</li>
                        <li>.env.local 파일에 PASS_CLIENT_ID 추가</li>
                    </ol>
                    <button onclick="window.close()" style="margin-top: 20px; padding: 10px 30px; background: #00C73C; color: #fff; border: none; border-radius: 8px; cursor: pointer;">닫기</button>
                </body>
            </html>
        `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // PASS API 인증 URL
    const passUrl = `https://api.skt-id.co.kr/oauth2/authorize?client_id=${PASS_CLIENT_ID}&redirect_uri=${APP_URL}/api/pass-auth/callback`;

    return NextResponse.redirect(passUrl);
}
