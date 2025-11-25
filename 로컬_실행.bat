@echo off
chcp 65001 >nul
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   K-Quest 로컬 실행 (임시 확인용)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

echo [1/2] 의존성 설치 중...
call npm install

echo.
echo [2/2] 개발 서버 시작...
echo.
echo ✅ 브라우저에서 http://localhost:3000 접속하세요!
echo.
call npm run dev
