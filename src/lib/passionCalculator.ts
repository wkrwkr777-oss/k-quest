/**
 * 열정 점수 계산기 (Passion Calculator)
 * 텍스트에 포함된 긍정적/능동적 단어와 길이를 분석하여 점수를 매깁니다.
 */

const PASSION_KEYWORDS = [
    '최선', '노력', '책임', '완수', '경험', '자신', '성실', '꼼꼼',
    '약속', '소통', '만족', '열정', '도전', '배우', '성장', '함께',
    'best', 'effort', 'responsible', 'experience', 'confident', 'sincere',
    'promise', 'communicate', 'satisfy', 'passion', 'challenge', 'learn'
]

export function calculatePassionScore(text: string): { score: number, level: string, feedback: string } {
    if (!text) return { score: 0, level: 'Low', feedback: '내용이 없습니다.' }

    let score = 0

    // 1. 길이 점수 (최대 40점)
    // 너무 짧으면 성의 없음, 적당히 길면 점수 부여
    const length = text.length
    if (length > 500) score += 40
    else if (length > 200) score += 30
    else if (length > 100) score += 20
    else score += 5

    // 2. 키워드 점수 (최대 40점)
    let keywordCount = 0
    PASSION_KEYWORDS.forEach(word => {
        if (text.includes(word)) keywordCount++
    })
    // 키워드 하나당 5점, 최대 40점
    score += Math.min(keywordCount * 5, 40)

    // 3. 구체성 점수 (최대 20점)
    // 숫자나 특수문자가 포함되어 있으면 구체적인 수치를 언급했을 가능성이 높음
    if (/[0-9]/.test(text)) score += 10
    if (/[!~]/.test(text)) score += 5 // 느낌표 등은 강조의 의미
    if (text.includes('예를 들어') || text.includes('경우')) score += 5

    // 레벨 산정
    let level = 'Bronze'
    let feedback = ''

    if (score >= 90) {
        level = '🔥 Passionate Master'
        feedback = '와우! 당신의 열정이 화면을 뚫고 나옵니다. 의뢰자가 감동할 거예요!'
    } else if (score >= 70) {
        level = '✨ Gold'
        feedback = '훌륭합니다! 구체적이고 성의 있는 제안서입니다.'
    } else if (score >= 50) {
        level = '🌱 Silver'
        feedback = '좋아요. 하지만 조금 더 구체적인 경험을 어필하면 좋을 것 같아요.'
    } else {
        level = '🥚 Bronze'
        feedback = '너무 짧거나 단순해요. 당신의 열정을 조금 더 보여주세요!'
    }

    return { score, level, feedback }
}
