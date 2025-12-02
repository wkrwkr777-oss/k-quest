export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
                <h1>K-Quest 이용약관</h1>
                <p className="text-gray-600">시행일: 2024년 12월 2일</p>

                <h2>제1조 (목적)</h2>
                <p>본 약관은 K-Quest(이하 "플랫폼")가 제공하는 퀘스트 중개 서비스의 이용과 관련하여 플랫폼과 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>

                <h2>제2조 (정의)</h2>
                <ol>
                    <li><strong>"플랫폼"</strong>이란 K-Quest가 운영하는 온라인 퀘스트 중개 서비스를 말합니다.</li>
                    <li><strong>"의뢰자"</strong>란 퀘스트를 등록하여 수행을 의뢰하는 회원을 말합니다.</li>
                    <li><strong>"수행자"</strong>란 퀘스트를 수행하는 회원을 말합니다.</li>
                </ol>

                <h2>제3조 (회원가입 및 이용 자격)</h2>
                <ol>
                    <li>만 <strong>19세 이상</strong>만 회원가입이 가능합니다.</li>
                    <li>회원가입 시 본인 인증을 거쳐야 합니다.</li>
                </ol>

                <h2>제4조 (수수료 및 결제)</h2>
                <ol>
                    <li>플랫폼은 퀘스트 완료 시 거래 금액의 <strong>30%</strong>를 서비스 이용 수수료로 부과합니다.</li>
                    <li>수행자는 총 거래 금액의 <strong>70%</strong>를 수령합니다.</li>
                </ol>

                <h2>제5조 (환불 및 취소)</h2>
                <ol>
                    <li>퀘스트 시작 전: 100% 환불</li>
                    <li>퀘스트 진행 중: 양측 합의 시 환불</li>
                    <li>퀘스트 완료 후: 원칙적으로 환불 불가</li>
                </ol>

                <h2>제6조 (면책 조항)</h2>
                <p>플랫폼은 <strong>중개자</strong>일 뿐이며, 회원 간 거래에서 발생한 손해에 대해 원칙적으로 책임을 지지 않습니다. 단, 플랫폼의 고의 또는 중과실로 인한 손해는 책임을 집니다.</p>

                <p className="text-sm text-gray-500 mt-8">
                    전체 약관은 <a href="/TERMS_AND_PRIVACY_FINAL.md" className="text-blue-600 underline" download>여기</a>에서 다운로드하실 수 있습니다.
                </p>
            </div>
        </div>
    )
}
