# 💳 결제 키 발급받는 법 (왕초보 가이드)

세희님, 천천히 따라오세요! 어렵지 않습니다.

---

## 1. PayPal (페이팔) 키 받기

1. **사이트 접속**: [https://developer.paypal.com](https://developer.paypal.com) 클릭!
2. **로그인**: 오른쪽 위 **[Log In]** 버튼 누르고, 페이팔 아이디로 로그인하세요.
3. **대시보드 이동**: 로그인 후 오른쪽 위 **[Dashboard]** 클릭!
4. **앱 만들기**:
   - 화면 중간에 **[Apps & Credentials]** 메뉴가 보입니다.
   - **[Create App]** 파란색 버튼 클릭!
   - **App Name**: `K-Quest` 라고 적으세요.
   - **Type**: `Merchant` 선택.
   - **[Create App]** 버튼 클릭!
5. **키 복사하기**:
   - 화면에 **Client ID** 라고 긴 영어가 보입니다. 👉 복사해서 `secrets.js` 의 `PAYPAL_CLIENT_ID` 에 붙여넣기!
   - 그 밑에 **Secret** 이라는 글자 옆에 **[Show]** 버튼을 누르세요.
   - 나오는 긴 영어를 복사해서 `secrets.js` 의 `PAYPAL_SECRET` 에 붙여넣기!

---

## 2. Stripe (스트라이프) 키 받기

1. **사이트 접속**: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register) 클릭!
2. **회원가입**: 이메일, 이름, 비밀번호 넣고 가입하세요. (이미 있으면 로그인)
3. **키 찾기**:
   - 로그인하면 화면 오른쪽 위에 **[Developers]** (개발자) 버튼 클릭!
   - 왼쪽 메뉴에서 **[API Keys]** 클릭!
4. **키 복사하기**:
   - **Publishable key** (pk_live_... 로 시작함) 👉 복사해서 `secrets.js` 의 `STRIPE_PUBLISHABLE_KEY` 에 붙여넣기!
   - **Secret key** (sk_live_... 로 시작함) 👉 **[Reveal live key]** 버튼 누르고 복사해서 `secrets.js` 의 `STRIPE_SECRET_KEY` 에 붙여넣기!

---

## 3. 마지막 단계

1. 바탕화면에 있는 **`secrets.js`** 파일을 메모장으로 여세요.
2. 위에서 복사한 키들을 따옴표(`""`) 안에 붙여넣으세요.
3. 저장하고 닫으세요.
4. **`적용하기.bat`** 파일을 더블클릭하세요.

**끝! 이제 돈을 벌 수 있습니다!** 💰🎉
