# K-Quest 배포 가이드

## 🚀 Vercel 배포 (quest-k.com)

### 1단계: GitHub에 코드 업로드
```bash
cd k-quest
git init
git add .
git commit -m "Initial commit - K-Quest with business registration"
git remote add origin https://github.com/your-username/k-quest.git
git push -u origin main
```

### 2단계: Vercel 배포
1. [vercel.com](https://vercel.com) 접속 및 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결 (k-quest)
4. 환경 변수 설정 (아래 참조)
5. Deploy 클릭

### 3단계: 환경 변수 입력 (Vercel Dashboard)
**.env.local 파일의 모든 내용을 복사해서 Vercel의 Environment Variables에 추가**

필수 환경 변수:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_DOMAIN=https://quest-k.com

# 사업자 정보 (자동 설정됨)
NEXT_PUBLIC_BUSINESS_NAME=포텐포텐
NEXT_PUBLIC_BUSINESS_NAME_EN=potenpoten
NEXT_PUBLIC_BUSINESS_OWNER=박세희
NEXT_PUBLIC_BUSINESS_OWNER_EN=Park Se-hee
NEXT_PUBLIC_BUSINESS_REGISTRATION_NUMBER=375-34-01719
NEXT_PUBLIC_ECOMMERCE_PERMIT_NUMBER=제2025-용인수지-3105호
NEXT_PUBLIC_BUSINESS_ADDRESS=경기도 용인시 수지구 풍덕대로2790번길 7, 3층 302-S86호 (죽전동)
NEXT_PUBLIC_BUSINESS_EMAIL=wkrwkr777@gmail.com
```

### 4단계: 도메인 연결
1. Vercel 프로젝트 Settings → Domains
2. `quest-k.com` 입력
3. DNS 설정 (도메인 등록 업체에서):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 5단계: 확인
- https://quest-k.com 접속
- `/company` 페이지에서 사업자 정보 확인
- Footer에 저작권 표시 확인

---

## 📱 PWA (모바일 앱) 설치

배포 후 모바일에서:
1. quest-k.com 접속
2. 브라우저 메뉴 → "홈 화면에 추가"
3. 앱처럼 사용 가능!

---

## 🔧 로컬 개발

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인

---

## ✅ 완료 체크리스트

- [x] 사업자 정보 등록 (624-17-02651)
- [x] 통신판매업 신고 (제2025-의정부송산-0387호)
- [x] 도메인 설정 (quest-k.com)
- [ ] Supabase 설정
- [ ] PayPal 계정 연동
- [ ] Stripe 계정 연동
- [ ] GitHub 업로드
- [ ] Vercel 배포
- [ ] DNS 연결

---

## 📞 문제 발생 시

contact@quest-k.com 또는 031-876-7968로 연락
