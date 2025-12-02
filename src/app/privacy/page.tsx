export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
                <h1>개인정보 처리방침</h1>
                <p className="text-gray-600">시행일: 2024년 12월 2일</p>

                <h2>1. 수집하는 개인정보 항목</h2>
                <h3>필수 항목</h3>
                <ul>
                    <li>이름, 이메일, 전화번호</li>
                    <li>프로필 사진</li>
                </ul>

                <h3>자동 수집 항목</h3>
                <ul>
                    <li>IP 주소, 쿠키, 접속 로그</li>
                </ul>

                <h2>2. 개인정보의 수집 및 이용 목적</h2>
                <ul>
                    <li>회원 관리 및 본인 확인</li>
                    <li>서비스 제공 및 계약 이행</li>
                    <li>결제 및 정산</li>
                    <li>부정 이용 방지</li>
                </ul>

                <h2>3. 개인정보의 보유 기간</h2>
                <ul>
                    <li>회원 탈퇴 시까지 보유</li>
                    <li>거래 기록: <strong>5년</strong> (전자상거래법)</li>
                    <li>분쟁 기록: <strong>3년</strong></li>
                </ul>

                <h2>4. 개인정보 보호책임자</h2>
                <p>이메일: wkrwkr777@gmail.com</p>

                <h2>5. 이용자의 권리</h2>
                <p>이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있습니다.</p>

                <p className="text-sm text-gray-500 mt-8">
                    전체 방침은 <a href="/TERMS_AND_PRIVACY_FINAL.md" className="text-blue-600 underline" download>여기</a>에서 다운로드하실 수 있습니다.
                </p>
            </div>
        </div>
    )
}
