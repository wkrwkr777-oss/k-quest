@echo off
chcp 65001 >nul
echo ====================================
echo GitHub 저장소에 K-Quest 업로드
echo ====================================
echo.
echo 1. GitHub에서 새 저장소를 만드세요:
echo    https://github.com/new
echo.
echo 2. Repository name: k-quest
echo    (Private 선택 추천)
echo    체크박스 3개 전부 해제!
echo    "Create repository" 클릭
echo.
echo 3. 저장소가 만들어지면 나오는 URL을 복사하세요
echo    예: https://github.com/wkrwkr777-oss/k-quest.git
echo.
set /p REPO_URL="4. 복사한 URL을 여기 붙여넣고 Enter: "
echo.
echo ====================================
echo Git 설정 중...
echo ====================================

REM Git 계정 설정
git config user.name "wkrwkr777-oss"
git config user.email "wkrwkr777@gmail.com"

REM 기존 remote 제거
git remote remove origin 2>nul

REM 새 remote 추가
git remote add origin %REPO_URL%

REM 브랜치 이름 확인/변경
git branch -M main

echo.
echo ====================================
echo 코드 업로드 중...
echo ====================================

REM 모든 파일 추가
git add .

REM 커밋
git commit -m "Initial commit - K-Quest platform deployment"

echo.
echo ====================================
echo GitHub에 업로드 시작...
echo ====================================
echo.
echo GitHub 로그인 창이 뜨면:
echo 1. wkrwkr777@gmail.com 계정으로 로그인
echo 2. 권한 허용 클릭
echo.

REM Push (자동으로 로그인 창이 뜹니다)
git push -u origin main

echo.
echo ====================================
echo 완료!
echo ====================================
echo.
echo 이제 Vercel에서 이 저장소를 Import 하면 됩니다!
echo.
pause
