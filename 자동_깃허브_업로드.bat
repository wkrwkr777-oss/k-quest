@echo off
chcp 65001 >nul
color 0A
cls

echo.
echo  ██╗  ██╗      ██████╗ ██╗   ██╗███████╗███████╗████████╗
echo  ██║ ██╔╝     ██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝
echo  █████╔╝█████╗██║   ██║██║   ██║█████╗  ███████╗   ██║   
echo  ██╔═██╗╚════╝██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║   
echo  ██║  ██╗     ╚██████╔╝╚██████╔╝███████╗███████║   ██║   
echo  ╚═╝  ╚═╝      ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   GitHub 자동 업로드 도구
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM GitHub Desktop 설치 확인
where gh >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ GitHub CLI 설치됨
) else (
    echo 📦 GitHub Desktop 설치 중...
    echo.
    echo 잠시만 기다려주세요... 브라우저가 열립니다!
    start https://desktop.github.com/
    echo.
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo  🎯 다음 단계:
    echo  1. "Download for Windows" 클릭
    echo  2. 다운로드한 파일 실행
    echo  3. GitHub 로그인 (wkrwkr777@gmail.com)
    echo  4. 설치 완료 후 이 창으로 돌아와서 아무 키나 누르기
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    pause
    cls
    echo.
    echo ✅ GitHub Desktop 설치 완료!
    echo 📤 이제 자동으로 업로드합니다...
    echo.
)

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  📋 저장소 정보 입력
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 브라우저가 열리는 순간:
echo 1. Repository name: k-quest
echo 2. Private 선택
echo 3. Create repository 클릭
echo 4. URL 복사 (예: https://github.com/wkrwkr777-oss/k-quest.git)
echo.

REM 브라우저 열기
start https://github.com/new

echo.
set /p REPO_URL="5. 복사한 URL을 붙여넣고 Enter: "

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  🔧 Git 설정 중...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

git config user.name "wkrwkr777-oss"
git config user.email "wkrwkr777@gmail.com"
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo ✅ Git 설정 완료!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  📦 파일 준비 중...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

git add .
git commit -m "🚀 K-Quest 초기 배포 - 결제 시스템 포함"

echo ✅ 파일 준비 완료!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  🚀 GitHub에 업로드 중...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ⚠️ 로그인 창이 뜨면:
echo    1. wkrwkr777@gmail.com으로 로그인
echo    2. "Authorize" 클릭
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo  ✅ 성공! GitHub 업로드 완료!
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo 🎉 모든 코드가 GitHub에 안전하게 저장되었습니다!
    echo.
    echo 📌 다음 단계:
    echo    1. Vercel (https://vercel.com) 열기
    echo    2. "Import Project" 클릭
    echo    3. 방금 만든 k-quest 저장소 선택
    echo    4. Deploy 클릭!
    echo.
    echo 🔗 저장소 주소: %REPO_URL%
    echo.
    start %REPO_URL%
) else (
    echo.
    echo ❌ 업로드 실패!
    echo.
    echo 📞 문제가 생겼나요?
    echo    스크린샷을 찍어서 AI에게 보여주세요!
    echo.
)

echo.
pause
