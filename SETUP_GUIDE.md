# 🚀 K-Quest 완벽 마스터 - 필수 패키지 설치 가이드

## 📦 필수 패키지 (즉시 설치)

```bash
npm install @supabase/ssr @supabase/supabase-js
```

## 🔧 환경 변수 설정 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음을 추가하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## ✅ 설치 확인

```bash
npm run dev
```

서버가 정상적으로 실행되면 모든 기능이 작동합니다!

## 🌐 페이지 테스트

- 홈: http://localhost:3000
- 로그인: http://localhost:3000/auth/signin  
- 회원가입: http://localhost:3000/auth/signup
- 퀘스트 목록: http://localhost:3000/quests
- 퀘스트 생성: http://localhost:3000/quests/create
