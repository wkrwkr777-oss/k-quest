@echo off
chcp 65001
cd /d "%~dp0"
echo ========================================================
echo [K-Quest] 강제 배포 모드 시작
echo ========================================================

:: 1. .vercel 폴더 삭제 (설정 초기화)
if exist .vercel (
    echo 기존 설정 초기화 중...
    rmdir /s /q .vercel
)

:: 2. 배포 시도
echo.
echo Vercel 배포를 시작합니다...
echo (로그인이 필요하면 브라우저가 열립니다)
echo.

call npx vercel --prod --yes --force

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo [오류] 배포 실패! 로그인이 필요할 수 있습니다.
    echo 로그인 절차를 시작합니다...
    echo ========================================================
    call npx vercel login
    
    echo.
    echo [재시도] 배포를 다시 시도합니다...
    call npx vercel --prod --yes --force
)

echo.
echo ========================================================
echo 모든 작업이 완료되었습니다.
echo 위 메시지에 에러가 없다면 https://quest-k.com 접속 확인!
echo ========================================================
pause
