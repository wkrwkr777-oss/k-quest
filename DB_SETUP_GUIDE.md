# 🚀 Supabase DB 설정 가이드 (사장님용)

## 1단계: Supabase 접속
- https://supabase.com 로그인
- 프로젝트 선택
- 왼쪽 메뉴 "SQL Editor" 클릭

## 2단계: 아래 파일들을 순서대로 실행하세요

### ① supabase_admin_chat.sql (관리자 채팅)
```
파일 위치: supabase_admin_chat.sql
내용을 복사해서 SQL Editor에 붙여넣기 → Run
```

### ② supabase_income_tracking.sql (소득 추적)
```
파일 위치: supabase_income_tracking.sql
내용을 복사해서 SQL Editor에 붙여넣기 → Run
```

### ③ supabase_error_logs.sql (에러 로그)
```
파일 위치: supabase_error_logs.sql
내용을 복사해서 SQL Editor에 붙여넣기 → Run
```

## 완료 확인
왼쪽 메뉴 "Table Editor"에서 다음 테이블들이 보이면 성공:
- admin_support_chats ✅
- admin_support_messages ✅
- performer_annual_income ✅
- error_logs ✅

---

## 문제 발생 시
에러 메시지가 뜨면:
1. 스크린샷 찍기
2. 제게 보내기 (제가 즉시 해결해드립니다)
