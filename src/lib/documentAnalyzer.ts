import Tesseract from 'tesseract.js'

export interface AnalysisResult {
    isValid: boolean
    extractedText: string
    keywordsFound: string[]
    summary: string
    confidence: number
}

// 검증할 키워드 목록
const KEYWORDS = {
    university: ['대학교', '대학원', '학생증', '재학', '졸업'],
    license: ['자격증', '면허증', '합격', '한국산업인력공단'],
    id: ['주민등록증', '운전면허증', '여권'],
}

export async function analyzeDocument(imageFile: File): Promise<AnalysisResult> {
    try {
        // 1. Tesseract OCR 실행 (브라우저에서 동작)
        const result = await Tesseract.recognize(
            imageFile,
            'kor+eng', // 한국어 + 영어 인식
            {
                logger: m => console.log(m) // 진행 상황 로깅
            }
        )

        const text = result.data.text
        const confidence = result.data.confidence

        // 2. 키워드 매칭
        const foundKeywords: string[] = []
        Object.values(KEYWORDS).flat().forEach(keyword => {
            if (text.includes(keyword)) {
                foundKeywords.push(keyword)
            }
        })

        // 3. 유효성 판단 (키워드가 하나라도 있거나 신뢰도가 높으면)
        const isValid = foundKeywords.length > 0 && confidence > 60

        // 4. 핵심 요약 생성
        const summary = isValid
            ? `✅ [AI 분석] 신뢰도 ${confidence.toFixed(0)}%로 문서가 인식되었습니다. 발견된 키워드: ${foundKeywords.join(', ')}`
            : `⚠️ [AI 분석] 문서 인식이 불명확합니다. (신뢰도 ${confidence.toFixed(0)}%). 관리자의 육안 확인이 필요합니다.`

        return {
            isValid,
            extractedText: text,
            keywordsFound: foundKeywords,
            summary,
            confidence
        }

    } catch (error) {
        console.error('OCR Error:', error)
        return {
            isValid: false,
            extractedText: '',
            keywordsFound: [],
            summary: '❌ AI 분석 중 오류가 발생했습니다.',
            confidence: 0
        }
    }
}
