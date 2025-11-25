@echo off
chcp 65001 >nul
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   K-Quest 원클릭 Vercel 배포
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

echo [1/4] Vercel 로그인 중...
echo.
call npx vercel login

echo.
echo [2/4] 프로젝트 배포 중...
echo.
call npx vercel --prod

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   ✅ 배포 완료!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 위에 표시된 URL을 확인하세요!
echo.
pause
