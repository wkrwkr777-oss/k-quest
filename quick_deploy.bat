@echo off

:: Change to the directory of this script
cd /d "%~dp0"

:: 1️⃣ Vercel 로그인 – 한 번만 하면 토큰이 저장됩니다
echo =============================
echo Vercel 로그인 (한 번만 필요합니다)
echo =============================
vercel login

:: 2️⃣ 프로덕션 배포
echo =============================
echo 프로덕션 배포 시작
echo =============================
vercel --prod

pause
