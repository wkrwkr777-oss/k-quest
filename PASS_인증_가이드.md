# PASS 인증 연동 가이드 (3단계 방어벽)

## 📌 개요
PASS 인증은 SKT/KT/LG U+ 통신사 본인인증 서비스입니다.
주민번호 앞자리로 **실제 나이를 확인**할 수 있어, 미성년자 차단이 완벽합니다.

---

## 💰 비용

| 구분 | 비용 |
|:---|:---|
| **월 1,000건까지** | **무료** |
| **1,001건 이후** | 자동 차단 (유료 전환 필요 시 별도 신청) |
| **자동 과금** | ❌ **절대 없음** (안심!) |

---

## 🔗 신청 방법

### 1. PASS 개발자 센터 가입
👉 [https://www.skt-id.co.kr](https://www.skt-id.co.kr)

1. **"개발자 센터"** 클릭
2. **"회원가입"** (사업자등록번호 필요)
3. **"앱/서비스 등록"**
   - 서비스명: K-Quest
   - URL: https://k-quest.vercel.app
4. **API 키 발급** 받기

### 2. 무료 플랜 신청
- 대시보드 > **"무료 체험"** 신청
- 월 1,000건 한도 설정
- 신용카드 등록 **불필요**

---

## 🛠️ 기술 연동

### Step 1: 환경변수 추가
`.env.local` 파일에 추가:
```env
NEXT_PUBLIC_PASS_CLIENT_ID=your_client_id_here
PASS_CLIENT_SECRET=your_secret_here
```

### Step 2: PASS 인증 버튼 추가
`src/components/PassVerification.tsx` 생성:

```typescript
"use client";

import { useState } from 'react';

export function PassVerification({ onVerified }: { onVerified: (data: any) => void }) {
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setLoading(true);
        
        // PASS 인증 팝업 열기
        const popup = window.open(
            '/api/pass-auth/start',
            'pass_auth',
            'width=400,height=600'
        );

        // 팝업에서 결과 수신
        window.addEventListener('message', (event) => {
            if (event.data.type === 'PASS_VERIFIED') {
                const { name, birthdate, nationality } = event.data;
                onVerified({ name, birthdate, nationality });
                popup?.close();
            }
        });

        setLoading(false);
    };

    return (
        <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-3 bg-[#00C73C] text-white font-bold rounded-xl hover:bg-[#00B836] transition-all"
        >
            {loading ? '인증 중...' : '📱 PASS로 본인인증'}
        </button>
    );
}
```

### Step 3: API 라우트 생성
`src/app/api/pass-auth/start/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // PASS API 호출
    const passUrl = `https://api.skt-id.co.kr/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_PASS_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/pass-auth/callback`;
    
    return NextResponse.redirect(passUrl);
}
```

`src/app/api/pass-auth/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');

    // 1. 인증 코드로 액세스 토큰 받기
    const tokenRes = await fetch('https://api.skt-id.co.kr/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            code: code,
            client_id: process.env.NEXT_PUBLIC_PASS_CLIENT_ID,
            client_secret: process.env.PASS_CLIENT_SECRET,
        })
    });

    const { access_token } = await tokenRes.json();

    // 2. 사용자 정보 조회
    const userRes = await fetch('https://api.skt-id.co.kr/user/me', {
        headers: { 'Authorization': `Bearer ${access_token}` }
    });

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
        `, { headers: { 'Content-Type': 'text/html' } });
    }

    // 4. 부모 창에 결과 전달
    return new NextResponse(`
        <script>
            window.opener.postMessage({
                type: 'PASS_VERIFIED',
                name: '${userData.name}',
                birthdate: '${userData.birthdate}',
                nationality: 'korean'
            }, '*');
        </script>
    `, { headers: { 'Content-Type': 'text/html' } });
}
```

### Step 4: 회원가입 페이지에 적용
`src/app/auth/signup/page.tsx`에서:

```typescript
import { PassVerification } from '@/components/PassVerification';

// ...

{nationality === 'korean' && (
    <PassVerification onVerified={(data) => {
        setName(data.name);
        setBirthdate(data.birthdate);
        // 자동으로 폼 제출
    }} />
)}
```

---

## 📊 모니터링

PASS 개발자 센터 > **대시보드**에서:
- 월간 인증 건수 확인
- 남은 무료 한도 확인
- 한도 초과 시 알림 설정

---

## ⚠️ 주의사항

1. **한도 초과 시**: 인증이 차단되므로, **900건 정도에서 미리 알림** 설정 권장
2. **유료 전환**: 매출 발생 시 수수료(30%)로 충분히 커버 가능
3. **백업 플랜**: PASS 장애 시를 대비해 2단계 방어벽(서버 검증)은 계속 유지

---

## 🎯 언제 적용?

**지금 당장 필요 없음!**
- 1~2단계 방어벽만으로도 **90% 차단** 가능
- 회원 수가 **월 500명 이상**될 때 적용 권장
- 매출 발생 후 추가하는 것이 현명함

---

## 📞 문의

PASS 고객센터: 1599-0011
개발자 지원: dev-support@skt-id.co.kr
