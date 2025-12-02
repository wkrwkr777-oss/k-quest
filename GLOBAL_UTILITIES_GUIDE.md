# 🌍 K-Quest 글로벌 편의 기능 (Global Utilities)

전 세계 사용자들이 언어와 시간의 장벽 없이 편리하게 이용할 수 있도록 돕는 기능입니다.

---

## 1️⃣ 실시간 환율 계산기 (Currency Visualizer) 💱

외국인 의뢰자가 원화(KRW) 금액을 직관적으로 이해할 수 있도록 돕습니다.

### 기능
- 모든 금액 표시 옆에 **달러(USD), 엔(JPY), 위안(CNY), 유로(EUR)** 환산 금액을 병기합니다.
- 예: `50,000원 (≈ $37.50 USD)`
- 무료 환율 API를 사용하여 매일 최신 환율을 반영합니다.

### 사용법
```tsx
import CurrencyDisplay from '@/components/CurrencyDisplay'

// 기본 (USD)
<CurrencyDisplay amountKRW={50000} />

// 일본인 사용자용 (JPY)
<CurrencyDisplay amountKRW={50000} targetCurrency="JPY" />
```

---

## 2️⃣ 현지 시간 표시기 (Local Time Badge) 🕒

시차가 있는 국가 간의 소통에서 발생할 수 있는 결례를 방지합니다.

### 기능
- 상대방의 프로필이나 채팅방 상단에 **상대방의 현재 시간**을 보여줍니다.
- **낮(☀️) / 밤(🌙)** 아이콘으로 직관적으로 상태를 알 수 있습니다.
- 예: `☀️ 한국 시간: 오후 2:30` / `🌙 뉴욕 시간: 오전 1:30`

### 사용법
```tsx
import LocalTimeDisplay from '@/components/LocalTimeDisplay'

// 한국 시간 표시 (기본값)
<LocalTimeDisplay />

// 뉴욕 시간 표시
<LocalTimeDisplay timezone="America/New_York" label="Client Time" />
```

---

## 🛠️ 개발자 참고사항

### 파일 위치
- 환율 컴포넌트: `src/components/CurrencyDisplay.tsx`
- 시간 컴포넌트: `src/components/LocalTimeDisplay.tsx`

### 성능 영향
- 두 기능 모두 클라이언트 사이드에서 가볍게 동작하므로 **서버 부하가 전혀 없습니다.**
- 환율 API는 무료 티어를 사용하며, 호출 실패 시 안전한 고정 환율(Fallback)로 자동 전환됩니다.

**작성일:** 2024-12-02  
**상태:** ✅ 구현 완료
