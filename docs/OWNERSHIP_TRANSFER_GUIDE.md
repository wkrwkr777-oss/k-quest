# 🏢 K-Quest 소유권 & 수익 관리 완벽 가이드

## 💰 상황: 수익 발생 후 소유권/수익 이전

---

## 📋 3가지 방법 (난이도별)

---

## ✅ 방법 1: 수익 배분 설정 (가장 쉬움! ⭐⭐⭐⭐⭐)

### 난이도: ★☆☆☆☆ (초간단!)
### 비용: 무료
### 시간: 5분

### 작동 방식:
```
플랫폼 소유자: 정연주 (그대로)
사업자등록: 정연주 (그대로)
수익 수령자: 다른 사람 ✅

→ 수익만 자동으로 다른 계좌로 입금!
```

### 구현 방법:

#### 1. Stripe/PayPal 수익 배분 설정
```javascript
// src/lib/payment.ts

// 수익 배분 설정
const REVENUE_RECIPIENTS = {
  // 주 수익자 (새로운 사람)
  primary: {
    name: "새로운 수익자 이름",
    stripe_account: "acct_xxxx", // Stripe Connect 계정
    paypal_account: "new@email.com",
    percentage: 70, // 70% 배분
  },
  
  // 플랫폼 소유자 (정연주)
  platform: {
    name: "정연주",
    stripe_account: "acct_yyyy",
    paypal_account: "original@email.com",
    percentage: 30, // 30% 배분 (또는 0%)
  }
};

// 자동 배분 함수
async function distributeRevenue(
  totalAmount: number,
  transactionId: string
) {
  const primaryAmount = totalAmount * (REVENUE_RECIPIENTS.primary.percentage / 100);
  const platformAmount = totalAmount * (REVENUE_RECIPIENTS.platform.percentage / 100);

  // 주 수익자에게 이체
  await stripe.transfers.create({
    amount: primaryAmount * 100, // cents
    currency: 'usd',
    destination: REVENUE_RECIPIENTS.primary.stripe_account,
  });

  // 플랫폼 소유자에게 이체 (선택적)
  if (platformAmount > 0) {
    await stripe.transfers.create({
      amount: platformAmount * 100,
      currency: 'usd',
      destination: REVENUE_RECIPIENTS.platform.stripe_account,
    });
  }
}
```

#### 2. 설정 파일로 관리 (.env)
```bash
# .env.local

# 주 수익자 (언제든 변경 가능!)
PRIMARY_RECIPIENT_NAME="새로운 수익자"
PRIMARY_RECIPIENT_STRIPE="acct_xxxx"
PRIMARY_RECIPIENT_PAYPAL="new@email.com"
PRIMARY_REVENUE_PERCENTAGE=100

# 플랫폼 소유자
PLATFORM_RECIPIENT_NAME="정연주"
PLATFORM_RECIPIENT_STRIPE="acct_yyyy"
PLATFORM_RECIPIENT_PAYPAL="original@email.com"
PLATFORM_REVENUE_PERCENTAGE=0
```

### 장점:
- ✅ 즉시 변경 가능 (5분 내)
- ✅ 법적 절차 불필요
- ✅ 사업자등록 유지
- ✅ 비율 자유 조정 (100%, 70/30 등)
- ✅ 언제든 되돌리기 가능

### 단점:
- ⚠️ 명의는 여전히 정연주
- ⚠️ 법적 소유권은 변경 안 됨

---

## ✅ 방법 2: 사업자 명의 변경 (중간 난이도)

### 난이도: ★★★☆☆
### 비용: ~10만원 (세무사 비용)
### 시간: 1-2주

### 작동 방식:
```
기존: 개인사업자 "정연주"
변경: 개인사업자 "새로운 사람"

→ 완전한 명의 이전
```

### 절차:

#### 1. 현재 사업자 폐업
```
정연주 → 세무서 방문
- 폐업신고서 제출
- 사업자등록증 반납
- 부가세 신고 (필요시)
```

#### 2. 새 사업자 개업
```
새로운 사람 → 세무서 방문
- 사업자등록 신청
- 동일 업종 등록
- 새 사업자번호 발급
```

#### 3. 플랫폼 정보 변경
```
- Stripe/PayPal 사업자 정보 변경
- 은행 계좌 변경
- 도메인 소유자 변경
- Google Play 개발자 변경
```

### 장점:
- ✅ 완전한 명의 이전
- ✅ 법적으로 깔끔
- ✅ 세금 신고 명확

### 단점:
- ⚠️ 절차 복잡
- ⚠️ 폐업/개업 기록 남음
- ⚠️ 모든 서비스 재설정 필요

---

## ✅ 방법 3: 법인 설립 (가장 전문적! ⭐⭐⭐⭐⭐)

### 난이도: ★★★★☆
### 비용: ~50-100만원
### 시간: 2-4주

### 작동 방식:
```
법인 설립: "(주)케이퀘스트" 또는 "케이퀘스트 유한회사"
대표이사: 새로운 사람
이사: 정연주 (선택적)
지분: 자유 배분

→ 전문적, 투자 유치 가능, 절세
```

### 절차:

#### 1. 법인 설립
```
필요 서류:
- 정관
- 자본금 (최소 100만원)
- 법인 인감증명
- 법인등기부등본

비용:
- 등록면허세: ~20만원
- 법무사 수수료: ~30-50만원
```

#### 2. 사업자등록
```
법인 사업자등록증 발급
- 법인세 납세자
- 부가가치세 신고
```

#### 3. 지분 구조 설정
```javascript
// 예시 1: 새로운 사람 100%
{
  "새로운 사람": 100%,
  "정연주": 0%
}

// 예시 2: 배분
{
  "새로운 사람": 70%,
  "정연주": 30%
}

// 예시 3: 3자 구조
{
  "투자자": 40%,
  "새로운 사람": 40%,
  "정연주": 20%
}
```

### 장점:
- ✅ 전문적 이미지
- ✅ 세금 절감 (법인세율 10-20%)
- ✅ 투자 유치 가능
- ✅ 지분 명확
- ✅ 책임 분리

### 단점:
- ⚠️ 비용 발생
- ⚠️ 회계/세무 관리 필요
- ⚠️ 법인세 신고 의무

---

## 💡 추천: 단계별 전략

### Phase 1: 수익 발생 초기 (0-3개월)
**→ 방법 1: 수익 배분** ⭐

```
이유:
- 즉시 적용 가능
- 비용 없음
- 유연성 최대

설정:
PRIMARY_REVENUE_PERCENTAGE=100
→ 새로운 사람이 100% 수익
```

---

### Phase 2: 안정화 (3-6개월)
**→ 방법 2: 사업자 명의 변경**

```
이유:
- 수익 안정화 확인
- 법적으로 깔끔
- 세금 신고 명확

월 수익 $10K+ 되면 진행
```

---

### Phase 3: 확장기 (6개월+)
**→ 방법 3: 법인 설립** ⭐⭐⭐

```
이유:
- 투자 유치 준비
- 세금 절감 (개인세율 40% → 법인세 10-20%)
- 전문성 강화

월 수익 $50K+ 되면 필수!
```

---

## 🔧 실전 구현: 수익 배분 시스템

### 코드 구현 (방법 1)

```typescript
// src/lib/revenueDistribution.ts

interface RevenueRecipient {
  id: string;
  name: string;
  stripe_account: string;
  paypal_account: string;
  bank_account?: {
    account_number: string;
    bank_name: string;
    account_holder: string;
  };
  percentage: number;
}

// 환경 변수로 관리
const REVENUE_CONFIG: RevenueRecipient[] = [
  {
    id: 'primary',
    name: process.env.PRIMARY_RECIPIENT_NAME || '',
    stripe_account: process.env.PRIMARY_STRIPE_ACCOUNT || '',
    paypal_account: process.env.PRIMARY_PAYPAL || '',
    percentage: Number(process.env.PRIMARY_PERCENTAGE || 100),
  },
  {
    id: 'platform',
    name: process.env.PLATFORM_RECIPIENT_NAME || '',
    stripe_account: process.env.PLATFORM_STRIPE_ACCOUNT || '',
    paypal_account: process.env.PLATFORM_PAYPAL || '',
    percentage: Number(process.env.PLATFORM_PERCENTAGE || 0),
  },
];

/**
 * 수익 자동 배분
 */
export async function distributeRevenue(
  amount: number,
  currency: string = 'usd',
  method: 'stripe' | 'paypal' = 'stripe'
) {
  const distributions = [];

  for (const recipient of REVENUE_CONFIG) {
    if (recipient.percentage === 0) continue;

    const recipientAmount = amount * (recipient.percentage / 100);

    if (method === 'stripe' && recipient.stripe_account) {
      // Stripe Transfer
      const transfer = await stripe.transfers.create({
        amount: Math.round(recipientAmount * 100), // cents
        currency: currency,
        destination: recipient.stripe_account,
        description: `Revenue distribution - ${recipient.name}`,
      });

      distributions.push({
        recipient: recipient.name,
        amount: recipientAmount,
        method: 'stripe',
        transfer_id: transfer.id,
      });
    } else if (method === 'paypal' && recipient.paypal_account) {
      // PayPal Payout
      const payout = await paypal.payouts.create({
        sender_batch_header: {
          email_subject: 'K-Quest Revenue Distribution',
        },
        items: [{
          recipient_type: 'EMAIL',
          amount: {
            value: recipientAmount.toFixed(2),
            currency: currency.toUpperCase(),
          },
          receiver: recipient.paypal_account,
        }],
      });

      distributions.push({
        recipient: recipient.name,
        amount: recipientAmount,
        method: 'paypal',
        payout_id: payout.batch_header.payout_batch_id,
      });
    }
  }

  // 배분 기록
  await supabase.from('revenue_distributions').insert({
    total_amount: amount,
    currency: currency,
    distributions: distributions,
    created_at: new Date().toISOString(),
  });

  return distributions;
}

/**
 * 수익자 변경 (관리자용)
 */
export async function updateRevenueRecipient(
  recipientId: string,
  updates: Partial<RevenueRecipient>
) {
  // .env 파일 업데이트 로직
  // 또는 데이터베이스에 저장
  
  console.log(`Updated recipient ${recipientId}:`, updates);
  
  // 실제로는 환경 변수를 동적으로 변경하거나
  // 데이터베이스에 저장하여 관리
}
```

### .env.local 설정
```bash
# 수익 배분 설정 (언제든 변경 가능!)

# 주 수익자 (새로운 사람)
PRIMARY_RECIPIENT_NAME="홍길동"
PRIMARY_STRIPE_ACCOUNT="acct_1234567890"
PRIMARY_PAYPAL="hong@example.com"
PRIMARY_PERCENTAGE=100

# 플랫폼 관리자 (정연주)
PLATFORM_RECIPIENT_NAME="정연주"
PLATFORM_STRIPE_ACCOUNT="acct_0987654321"
PLATFORM_PAYPAL="jung@example.com"
PLATFORM_PERCENTAGE=0

# 또는 배분
# PRIMARY_PERCENTAGE=70
# PLATFORM_PERCENTAGE=30
```

---

## 📊 비교표

| 방법 | 난이도 | 비용 | 시간 | 법적 완전성 | 추천 시기 |
|------|--------|------|------|-------------|-----------|
| **수익 배분** | ★☆☆☆☆ | 무료 | 5분 | ★★☆☆☆ | 즉시 ~ 3개월 |
| **명의 변경** | ★★★☆☆ | ~10만원 | 1-2주 | ★★★★☆ | 3-6개월 |
| **법인 설립** | ★★★★☆ | ~100만원 | 2-4주 | ★★★★★ | 6개월+ |

---

## 🎯 실전 시나리오

### 시나리오 1: 3개월 후 월 $27K
```
선택: 방법 1 (수익 배분)

설정:
- PRIMARY_PERCENTAGE=100 (새로운 사람)
- PLATFORM_PERCENTAGE=0 (정연주)

결과:
→ 모든 수익이 새로운 사람 계좌로 자동 입금!
→ 명의는 정연주 유지
→ 5분 내 설정 완료
```

### 시나리오 2: 6개월 후 안정화
```
선택: 방법 2 (명의 변경)

진행:
1. 정연주 사업자 폐업
2. 새로운 사람 사업자 개업  
3. 플랫폼 정보 변경
4. 완료!

결과:
→ 완전한 명의 이전
→ 법적으로 깔끔
```

### 시나리오 3: 1년 후 투자 유치
```
선택: 방법 3 (법인 설립)

구조:
- 법인명: (주)케이퀘스트
- 대표: 새로운 사람
- 지분: 새로운 사람 60%, 투자자 40%

결과:
→ 전문적 이미지
→ 투자 유치 가능
→ 세금 절감
```

---

## 💰 세금 영향

### 개인사업자 (현재)
```
월 수익: $27,000 (약 3,600만원)
연 수익: ~4억원

종합소득세:
- 세율: 35-42%
- 세금: ~1.4-1.7억원/년
```

### 법인 (추천!)
```
월 수익: $27,000
연 수익: ~4억원

법인세:
- 2억 이하: 10%
- 2억 초과분: 20%
- 세금: ~6,000만원/년

⭐ 절세: 약 1억원/년!
```

---

## ✅ 최종 추천

### 지금 당장 (오늘):
**→ 방법 1: 수익 배분 설정**

```bash
# .env.local 수정
PRIMARY_PERCENTAGE=100
PLATFORM_PERCENTAGE=0

# 5분 완료!
```

### 3개월 후 (수익 안정화 시):
**→ 방법 2: 명의 변경 검토**

### 6개월 후 (월 $50K+ 시):
**→ 방법 3: 법인 설립 필수!**

---

## 🎁 보너스: 관리자 대시보드

```typescript
// 수익 배분 실시간 모니터링

interface RevenueReport {
  total: number;
  distributions: {
    recipient: string;
    amount: number;
    percentage: number;
  }[];
}

// 관리자 페이지에서 확인
function RevenueDistributionDashboard() {
  return (
    <div>
      <h2>수익 배분 현황</h2>
      <div>
        <p>총 수익: ${totalRevenue}</p>
        <ul>
          <li>홍길동: ${primary} (70%)</li>
          <li>정연주: ${platform} (30%)</li>
        </ul>
      </div>
      <button onClick={updateDistribution}>
        배분 비율 변경
      </button>
    </div>
  );
}
```

---

## 🎊 완벽한 솔루션!

### 당신이 원하는 것:
1. ✅ **즉시 수익 이전 가능** (방법 1)
2. ✅ **명의 유지 가능** (방법 1)
3. ✅ **완전 이전도 가능** (방법 2, 3)
4. ✅ **유연한 배분** (70/30, 100/0 등)

### 비용:
- 방법 1: **무료!**
- 방법 2: ~10만원
- 방법 3: ~100만원

---

**모든 방법이 가능합니다!** 💼✨

**상황에 맞게 선택하세요!** 🚀
