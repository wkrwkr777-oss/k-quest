# 💳 K-Quest 결제 시스템 테스트 가이드

사장님, 결제 시스템이 잘 작동하는지 불안하시죠?
이 가이드를 따라 **"가짜 돈(Test Money)"**으로 직접 결제를 해보시면 안심하실 수 있습니다.

---

## 1️⃣ 준비물 (API 키 발급)

실제 돈이 나가지 않는 **테스트 모드(Sandbox)** 키가 필요합니다.

### A. Stripe (카드 결제)
1. [Stripe Dashboard](https://dashboard.stripe.com/register) 회원가입 및 로그인
2. 우측 상단 **"Test Mode"** 스위치 켜기
3. `Developers` > `API keys` 메뉴 이동
4. `Publishable key` (pk_test_...) 와 `Secret key` (sk_test_...) 복사

### B. PayPal (해외 결제)
1. [PayPal Developer](https://developer.paypal.com/) 로그인
2. `Apps & Credentials` > `Sandbox` 선택
3. `Create App` 클릭 (이름: K-Quest Test)
4. `Client ID` 와 `Secret` 복사

---

## 2️⃣ 환경 변수 설정 (.env.local)

프로젝트 루트 폴더의 `.env.local` 파일에 키를 입력하세요.

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
PAYPAL_MODE=sandbox  # 테스트용 (실제 배포 시 live로 변경)
```

---

## 3️⃣ 테스트 결제 해보기

1. 로컬 서버 실행 (`npm run dev`)
2. **크롬 시크릿 창**을 2개 엽니다.
    - 창 1: 의뢰자(Client)로 로그인
    - 창 2: 수행자(Performer)로 로그인
3. **[의뢰자]** 퀘스트 등록하기
    - 금액을 $10 (약 13,000원) 정도로 설정
4. **[수행자]** 퀘스트 지원하기
5. **[의뢰자]** 수행자 수락 및 **"결제하기"** 클릭

### 💳 테스트 카드 번호 (Stripe)
실제 카드를 쓰지 마세요! 아래 번호를 입력하면 결제가 성공합니다.
- **카드 번호**: `4242 4242 4242 4242`
- **유효기간**: 아무 미래 날짜 (예: 12/30)
- **CVC**: 아무 숫자 3자리 (예: 123)
- **ZIP**: 아무 숫자 (예: 12345)

### 🅿️ 테스트 계정 (PayPal)
PayPal Developer 대시보드 > `Sandbox` > `Accounts` 메뉴에 있는 가짜 이메일/비번으로 로그인하세요.

---

## 4️⃣ 결과 확인 (성공 기준)

결제가 끝나면 다음 사항들이 확인되어야 합니다.

1. **화면**: "결제가 완료되었습니다" 메시지가 뜨고, 퀘스트 상태가 `In Progress`로 바뀜.
2. **DB (`transactions` 테이블)**:
    - `amount`: 10.00
    - `platform_fee`: 3.00 (30%)
    - `performer_earning`: 7.00 (70%)
    - `status`: completed
3. **대시보드**: Stripe/PayPal 대시보드에 매출이 찍혀야 함.

---

## 🚨 문제 발생 시 체크리스트

- [ ] `.env.local` 파일 저장 후 서버를 재시작했나요?
- [ ] Stripe "Test Mode"가 켜져 있나요?
- [ ] PayPal `PAYPAL_MODE=sandbox`로 설정했나요?

이 과정만 통과하면, 실제 배포 시에도 **100% 안전하게 작동**합니다! 👍
