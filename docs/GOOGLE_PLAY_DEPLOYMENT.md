# Google Play Store 배포 완벽 가이드 (TWA)

## 📱 K-Quest Android App 배포

### TWA (Trusted Web Activity) 방식 사용
- ✅ 웹 앱을 네이티브 앱처럼 실행
- ✅ 30분 내 배포 가능
- ✅ 별도의 네이티브 코드 불필요

---

## 🛠️ 준비 단계

### 1. Android Studio 설치
```bash
# https://developer.android.com/studio 다운로드
# 설치 후 SDK 자동 설정
```

### 2. Bubblewrap CLI 설치
```bash
npm install -g @bubblewrap/cli

# 초기화
bubblewrap init --manifest=https://quest-k.com/manifest.json
```

### 3. 디지털 서명 키 생성
```bash
# keystore 생성
keytool -genkey -v -keystore k-quest-release.keystore \
  -alias k-quest -keyalg RSA -keysize 2048 -validity 10000

# 정보 입력:
이름: Potentaro
조직: K-Quest
국가: KR
```

---

## 📝 필수 파일 설정

### 1. manifest.json (이미 있음, 확인만)
```json
{
  "name": "K-Quest",
  "short_name": "K-Quest",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1A1A1A",
  "theme_color": "#D4AF37",
  "orientation": "portrait",
  "icons": [ ... ]
}
```

### 2. assetlinks.json 생성
`public/.well-known/assetlinks.json`

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.kquest.app",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

SHA256 지문 얻기:
```bash
keytool -list -v -keystore k-quest-release.keystore
```

---

## 🚀 TWA 프로젝트 생성

### Bubblewrap로 APK/AAB 빌드

```bash
# 1. 프로젝트 초기화
bubblewrap init --manifest https://quest-k.com/manifest.json

# 입력 정보:
- Package name: com.kquest.app
- App name: K-Quest
- Display mode: standalone
- Orientation: portrait
- Theme color: #D4AF37
- Background color: #1A1A1A
- Start URL: https://quest-k.com
- Icon URL: https://quest-k.com/icon-512x512.png

# 2. 빌드
bubblewrap build

# 3. APK 생성 (테스트용)
# app/build/outputs/apk/release/app-release.apk

# 4. AAB 생성 (Play Store용)
# app/build/outputs/bundle/release/app-release.aab
```

---

## 📦 Google Play Console 설정

### 1. Play Console 계정 생성
- https://play.google.com/console
- 개발자 등록 ($25 일회성)

### 2. 앱 생성
```
이름: K-Quest
카테고리: 여행 및 지역정보
```

### 3. 앱 콘텐츠 설정

#### 개인정보 처리방침
URL: `https://quest-k.com/privacy`

#### 타겟 연령
- 18세 이상

#### 앱 접근 권한
```
인터넷: 예
위치: 아니오
카메라: 아니오 (향후 추가 가능)
저장공간: 예
```

### 4. 스토어 등록정보

#### 짧은 설명 (80자)
```
Premium Quest Concierge Service in Korea - Connect with Korean Experts
```

#### 전체 설명 (4000자)
```
🌟 K-QUEST - Your Premium Korean Adventure Companion

Discover Korea like never before with K-Quest, the ultimate platform connecting global travelers with verified local Korean experts.

✨ WHAT IS K-QUEST?

K-Quest is a premium concierge service that helps foreigners navigate Korean culture, food, shopping, and experiences through a unique quest-based system. Post your needs, connect with trusted locals, and make your Korean adventure unforgettable.

🎯 KEY FEATURES

• Quest-Based System: Post what you need, locals bid to help
• Verified Experts: All service providers are verified
• Secure Payment: Protected transactions with escrow system
• Real-Time Chat: Communicate safely within the app
• Review System: Transparent ratings and reviews
• Multi-Language: English & Korean support
• Premium Experiences: From dining to cultural tours

🌏 FOR TRAVELERS

- Restaurant Reservations at exclusive Korean spots
- Private Photo Sessions at iconic locations
- VIP Transportation & Guides
- Shopping Assistance & Personal Styling
- Cultural Experience Planning
- Language Translation Services
- Local Insider Tips

💼 FOR KOREAN LOCALS

- Earn Extra Income helping foreigners
- Share your Korean expertise
- Flexible Work Schedule
- Safe & Secure Platform
- Build Your Reputation

🔒 SAFETY & SECURITY

• Anti-Fraud System
• Secure Payment Processing
• Verified User Profiles
• 24/7 Customer Support
• Platform-Monitored Communications

💰 TRANSPARENT PRICING

• No Hidden Fees
• Competitive Rates
• Secure Escrow System
• Easy Withdrawals

📱 DOWNLOAD NOW

Join thousands of travelers and locals creating amazing Korean experiences together!

---

K-Quest - Premium Quest Concierge Service
Website: quest-k.com
Support: support@quest-k.com
