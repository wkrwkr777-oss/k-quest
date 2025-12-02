# 🚀 K-Quest 배포 완벽 가이드

## 📅 배포 순서
1. ✅ **웹 배포** (Vercel) - 무료
2. ✅ **앱 배포** (Google Play) - $25 (1회)

---

# PART 1: 웹 배포 (30분 소요)

## STEP 1: GitHub 업로드 (5분)

### 1-1. Git 초기화
```bash
cd k-quest
git init
git add .
git commit -m "Initial commit - K-Quest ready for deployment"
```

### 1-2. GitHub 저장소 만들기
1. [github.com](https://github.com) 접속 → 로그인
2. 오른쪽 위 **"+"** → **"New repository"**
3. Repository name: `k-quest`
4. **Public** 선택
5. **Create repository** 클릭

### 1-3. GitHub에 업로드
```bash
git remote add origin https://github.com/your-username/k-quest.git
git branch -M main
git push -u origin main
```

---

## STEP 2: Vercel 배포 (10분)

### 2-1. Vercel 가입 및 프로젝트 생성
1. [vercel.com](https://vercel.com) 접속
2. **"Sign Up"** → GitHub 계정으로 로그인
3. **"New Project"** 클릭
4. **"Import Git Repository"** → `k-quest` 선택
5. **"Import"** 클릭

### 2-2. 환경 변수 설정
**Environment Variables** 섹션에서 `.env.local` 내용 복사:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Domain
NEXT_PUBLIC_DOMAIN=https://quest-k.com

# Business Info
NEXT_PUBLIC_BUSINESS_NAME=포텐포텐
NEXT_PUBLIC_BUSINESS_NAME_EN=potenpoten
NEXT_PUBLIC_BUSINESS_OWNER=박세희
NEXT_PUBLIC_BUSINESS_OWNER_EN=Park Se-hee
NEXT_PUBLIC_BUSINESS_REGISTRATION_NUMBER=375-34-01719
NEXT_PUBLIC_ECOMMERCE_PERMIT_NUMBER=제2025-용인수지-3105호
NEXT_PUBLIC_BUSINESS_ADDRESS=경기도 용인시 수지구 풍덕대로2790번길 7, 3층 302-S86호 (죽전동)
NEXT_PUBLIC_BUSINESS_EMAIL=wkrwkr777@gmail.com
```

### 2-3. 배포 시작
**"Deploy"** 버튼 클릭 → 3~5분 대기

---

## STEP 3: 도메인 연결 (15분)

### 3-1. Vercel에서 도메인 추가
1. Vercel 프로젝트 → **Settings** → **Domains**
2. `quest-k.com` 입력 → **Add**

### 3-2. 도메인 등록업체에서 DNS 설정
**도메인을 구매한 곳**(예: 가비아, 후이즈)에서:

#### A Record 추가:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 자동
```

#### CNAME Record 추가:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 자동
```

### 3-3. 확인 (10분~1시간 대기)
- ✅ https://quest-k.com 접속
- ✅ SSL 자동 적용 확인
- ✅ 사이트 정상 작동 확인

---

# PART 2: 앱 배포 (Google Play Store)

## 💰 비용: $25 (1회 결제, 평생 사용)

### 준비물:
- ✅ 웹사이트 배포 완료 (quest-k.com)
- ✅ Google 계정
- ✅ 신용카드 ($25 결제용)

---

## STEP 4: Google Play Console 등록 (30분)

### 4-1. 개발자 계정 생성
1. [play.google.com/console](https://play.google.com/console) 접속
2. **$25 결제** (1회만, 평생 사용)
3. 개발자 정보 입력:
   - 이름: Potentaro (Jeong Yeon-ju)
   - 이메일: wkrwkr777@gmail.com

### 4-2. 앱 생성
1. **"Create app"** 클릭
2. 앱 정보 입력:
   - **App name**: K-Quest
   - **Default language**: Korean
   - **App or game**: App
   - **Free or paid**: Free

---

## STEP 5: TWA (Trusted Web Activity) 앱 만들기

### 5-1. Bubblewrap 설치 (명령어)
```bash
npm install -g @bubblewrap/cli
```

### 5-2. TWA 프로젝트 생성
```bash
cd k-quest
bubblewrap init --manifest https://quest-k.com/manifest.json
```

### 5-3. Android 앱 빌드
```bash
bubblewrap build
```

### 5-4. 생성된 APK/AAB 파일 확인
- 위치: `k-quest/app-release-bundle.aab`

---

## STEP 6: Google Play에 업로드 (30분)

### 6-1. Store Listing 작성
- **App name**: K-Quest
- **Short description**: Premium Quest Concierge Service in Korea
- **Full description**:
```
K-Quest는 한국에서 최고의 프리미엄 컨시어지 서비스를 제공합니다.

주요 기능:
✅ 한국 여행 및 비즈니스 지원
✅ 전문가 매칭
✅ 안전한 결제 시스템
✅ 다국어 지원 (한국어/영어)
```

### 6-2. 스크린샷 준비
- 최소 2개 필요 (1080x1920 권장)
- 앱 실행 화면 캡처

### 6-3. 앱 아이콘 업로드
- High-res icon: `icon-512x512.png`

### 6-4. AAB 파일 업로드
1. **Production** → **Create new release**
2. `app-release-bundle.aab` 업로드
3. **Review release** → **Start rollout to Production**

---

## STEP 7: 앱 심사 대기 (1~3일)

Google이 앱을 검토합니다.
- ✅ 승인되면 Play Store에 게시됨
- ❌ 거절되면 수정 후 재제출

---

# 📋 체크리스트

## 웹 배포
- [ ] GitHub에 코드 업로드
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] 도메인 DNS 설정
- [ ] quest-k.com 접속 확인

## 앱 배포
- [ ] Google Play Console 계정 생성 ($25)
- [ ] TWA 앱 빌드
- [ ] Store Listing 작성
- [ ] 스크린샷 준비
- [ ] AAB 파일 업로드
- [ ] 심사 대기

---

# 🆘 문제 발생 시

### Vercel 배포 실패
- 환경 변수 재확인
- `npm run build` 로컬에서 테스트

### 도메인 연결 안 됨
- DNS 설정 재확인 (10분~1시간 대기)
- Vercel에서 도메인 재추가

### Google Play 거절
- 콘텐츠 정책 확인
- TWA 설정 재확인
- Digital Asset Links 설정

---

# 📞 연락처
wkrwkr777@gmail.com

행운을 빕니다! 🚀
