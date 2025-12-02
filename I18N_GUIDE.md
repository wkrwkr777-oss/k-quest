# 🌍 K-Quest 글로벌 다국어 시스템 (i18n)

두바이 부자부터 일본인 관광객까지, 전 세계 누구나 편하게 쓸 수 있는 **5개 국어 완벽 지원** 시스템입니다.

---

## 1️⃣ 지원 언어 (Supported Languages)

| 언어 | 코드 | 특징 |
| :--- | :--- | :--- |
| 한국어 | `ko` | 기본 언어 |
| English | `en` | 글로벌 표준 |
| 日本語 | `ja` | 일본인 관광객 타겟 |
| 中文 | `zh` | 중국인 관광객 타겟 |
| **العربية** | `ar` | **RTL(우->좌) 레이아웃** 및 전용 폰트 지원 |

---

## 2️⃣ 작동 원리 (Architecture)

### A. UI 번역 (Static Text)
- `src/lib/i18n/dictionaries.ts` 파일에 모든 번역 데이터가 들어있습니다.
- 사용자가 언어를 바꾸면, 앱 전체의 텍스트가 즉시 바뀝니다.

### B. RTL 지원 (Arabic Layout)
- 아랍어를 선택하면 `LanguageContext`가 이를 감지하여 `dir="rtl"` 속성을 적용합니다.
- 화면의 모든 배치가 **거울처럼 반전**되어 아랍어 사용자에게 익숙한 환경을 제공합니다.
- 폰트도 구글의 `Noto Sans Arabic`으로 자동 변경되어 가독성을 높입니다.

### C. 실시간 채팅 통역 (Live Translation)
- `useTranslator` 훅이 현재 선택된 언어를 감지합니다.
- 아랍어 사용자가 채팅을 보내면 -> 한국어 수행자에게는 한국어로 보입니다.
- 한국어 수행자가 답장을 보내면 -> 아랍어 사용자에게는 아랍어로 보입니다.

---

## 3️⃣ 사용법 (How to Use)

### 언어 변경
화면 상단(또는 메뉴)에 있는 `LanguageSwitcher` 드롭다운을 통해 언제든 언어를 변경할 수 있습니다.

### 번역 데이터 추가
새로운 문구를 추가하려면 `dictionaries.ts` 파일만 수정하면 됩니다.

```typescript
// dictionaries.ts
export const dictionaries = {
    ko: { new_text: '안녕하세요' },
    en: { new_text: 'Hello' },
    // ...
}
```

---

## 🛠️ 개발자 참고사항

### 파일 위치
- 사전 데이터: `src/lib/i18n/dictionaries.ts`
- 언어 컨텍스트: `src/contexts/LanguageContext.tsx`
- 언어 선택기: `src/components/LanguageSwitcher.tsx`
- 번역기 훅: `src/hooks/useTranslator.ts`

**작성일:** 2024-12-02  
**상태:** ✅ 구현 완료
