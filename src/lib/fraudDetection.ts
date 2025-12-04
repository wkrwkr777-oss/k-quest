// ============================================
// AI 사기 탐지 시스템 (100% 무료!)
// ============================================
// Google Gemini API 무료 사용
// 안전장치: 일일 제한, 에러 시 룰 베이스

import { supabase } from './supabase';

// ============================================
// 무료 안전장치 설정
// ============================================
const MAX_AI_REQUESTS_PER_DAY = 50; // 무료 한도 대비 안전한 수치
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';

// ============================================
// AI 사용량 체크
// ============================================
async function checkAIUsageToday(): Promise<number> {
    try {
        const today = new Date().toISOString().split('T')[0];

        const { count } = await supabase
            .from('fraud_detection_logs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', `${today}T00:00:00`)
            .not('ai_analysis', 'is', null);

        return count || 0;
    } catch (error) {
        console.error('Failed to check AI usage:', error);
        return 999; // 에러 시 AI 사용 안 함
    }
}

// ============================================
// 룰 베이스 사기 탐지 (무료!)
// ============================================
function ruleBasedFraudCheck(data: {
    userId?: string;
    questId?: string;
    title?: string;
    description?: string;
    price?: number;
    userCreatedAt?: string;
}): {
    isSuspicious: boolean;
    suspicionType: string | null;
    confidence: number;
    reason: string;
} {
    // 1. 의심스러운 키워드 체크
    const suspiciousKeywords = [
        '급전', '대출', '비트코인', '투자', '수익보장',
        '무조건', '100%', '대박', '떼돈', '쉽게',
        '클릭만', '가입만', '확정수익'
    ];

    const text = `${data.title || ''} ${data.description || ''}`.toLowerCase();
    const hasSuspiciousKeyword = suspiciousKeywords.some(keyword =>
        text.includes(keyword)
    );

    if (hasSuspiciousKeyword) {
        return {
            isSuspicious: true,
            suspicionType: 'suspicious_message',
            confidence: 0.75,
            reason: '의심스러운 키워드 발견'
        };
    }

    // 2. 비정상적인 가격
    if (data.price && (data.price < 1000 || data.price > 10000000)) {
        return {
            isSuspicious: true,
            suspicionType: 'unusual_payment',
            confidence: 0.65,
            reason: '비정상적인 가격 설정'
        };
    }

    // 3. 신규 사용자 고액 거래
    if (data.userCreatedAt && data.price && data.price > 1000000) {
        const accountAge = Date.now() - new Date(data.userCreatedAt).getTime();
        const daysOld = accountAge / (1000 * 60 * 60 * 24);

        if (daysOld < 7) {
            return {
                isSuspicious: true,
                suspicionType: 'fake_profile',
                confidence: 0.70,
                reason: '신규 계정 고액 거래'
            };
        }
    }

    // 4. 중복 내용 (간단 체크)
    const duplicatePatterns = /(.{10,})\1{2,}/; // 같은 문구 3번 반복
    if (duplicatePatterns.test(text)) {
        return {
            isSuspicious: true,
            suspicionType: 'duplicate_content',
            confidence: 0.60,
            reason: '중복된 내용 발견'
        };
    }

    return {
        isSuspicious: false,
        suspicionType: null,
        confidence: 0,
        reason: '정상'
    };
}

// ============================================
// AI 사기 탐지 (Gemini - 무료!)
// ============================================
async function aiBasedFraudCheck(data: {
    title?: string;
    description?: string;
    price?: number;
}): Promise<{
    isSuspicious: boolean;
    suspicionType: string | null;
    confidence: number;
    aiAnalysis: any;
}> {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        const prompt = `
다음 Quest가 사기인지 판단해주세요. 응답은 JSON 형식으로만 해주세요.

제목: ${data.title}
설명: ${data.description}
가격: ${data.price}원

의심스러운 점:
1. 비현실적인 수익 약속
2. 급전/대출 관련
3. 개인정보 요구
4. 선입금 요구
5. 불법 행위

JSON 응답:
{
  "isSuspicious": true/false,
  "suspicionType": "fake_profile|suspicious_message|unusual_payment|duplicate_content",
  "confidence": 0.0-1.0,
  "reason": "간단한 이유"
}
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            }
        );

        if (!response.ok) throw new Error('Gemini API failed');

        const result = await response.json();
        const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

        // JSON 파싱 시도
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        const aiAnalysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

        return {
            isSuspicious: aiAnalysis.isSuspicious || false,
            suspicionType: aiAnalysis.suspicionType || null,
            confidence: aiAnalysis.confidence || 0.5,
            aiAnalysis
        };

    } catch (error) {
        console.error('AI fraud check failed:', error);
        // AI 실패 시 룰 베이스로 대체
        return {
            isSuspicious: false,
            suspicionType: null,
            confidence: 0,
            aiAnalysis: { error: 'AI unavailable, using rule-based' }
        };
    }
}

// ============================================
// 메인 사기 탐지 함수
// ============================================
export async function detectFraud(params: {
    userId?: string;
    questId?: string;
    title?: string;
    description?: string;
    price?: number;
    userCreatedAt?: string;
}): Promise<{
    isSuspicious: boolean;
    suspicionType: string | null;
    confidence: number;
    usedAI: boolean;
}> {
    try {
        // 1. 먼저 룰 베이스 체크 (무료!)
        const ruleCheck = ruleBasedFraudCheck(params);

        // 룰 베이스에서 의심스러우면 바로 반환
        if (ruleCheck.isSuspicious && ruleCheck.confidence > 0.7) {
            await logFraudDetection({
                ...params,
                ...ruleCheck,
                usedAI: false
            });

            return {
                ...ruleCheck,
                usedAI: false
            };
        }

        // 2. AI 사용량 체크
        const aiUsageToday = await checkAIUsageToday();

        // 무료 한도 초과 시 룰 베이스만 사용
        if (aiUsageToday >= MAX_AI_REQUESTS_PER_DAY) {
            console.log('AI daily limit reached, using rule-based only');
            await logFraudDetection({
                ...params,
                ...ruleCheck,
                usedAI: false
            });

            return {
                ...ruleCheck,
                usedAI: false
            };
        }

        // 3. AI 체크 (무료 한도 내)
        const aiCheck = await aiBasedFraudCheck(params);

        // AI와 룰 베이스 결과 통합
        const finalResult = {
            isSuspicious: aiCheck.isSuspicious || ruleCheck.isSuspicious,
            suspicionType: aiCheck.suspicionType || ruleCheck.suspicionType,
            confidence: Math.max(aiCheck.confidence, ruleCheck.confidence),
            usedAI: true
        };

        // 로그 저장
        await logFraudDetection({
            ...params,
            ...finalResult,
            aiAnalysis: aiCheck.aiAnalysis
        });

        return finalResult;

    } catch (error) {
        console.error('Fraud detection failed:', error);
        // 에러 시 안전하게 통과
        return {
            isSuspicious: false,
            suspicionType: null,
            confidence: 0,
            usedAI: false
        };
    }
}

// ============================================
// 로그 저장
// ============================================
async function logFraudDetection(params: any) {
    try {
        await supabase.from('fraud_detection_logs').insert({
            user_id: params.userId,
            quest_id: params.questId,
            suspicion_type: params.suspicionType,
            confidence_score: params.confidence,
            ai_analysis: params.aiAnalysis || { rule_based: true },
            action_taken: params.isSuspicious ? 'flagged' : 'approved'
        });
    } catch (error) {
        console.error('Failed to log fraud detection:', error);
    }
}

// ============================================
// 사용 통계
// ============================================
export async function getFraudStats(): Promise<{
    totalChecks: number;
    aiChecks: number;
    ruleChecks: number;
    suspiciousFound: number;
}> {
    try {
        const { data } = await supabase
            .from('fraud_detection_logs')
            .select('*');

        const totalChecks = data?.length || 0;
        const aiChecks = data?.filter(d => d.ai_analysis && !d.ai_analysis.rule_based).length || 0;
        const suspiciousFound = data?.filter(d => d.action_taken === 'flagged').length || 0;

        return {
            totalChecks,
            aiChecks,
            ruleChecks: totalChecks - aiChecks,
            suspiciousFound
        };
    } catch (error) {
        return { totalChecks: 0, aiChecks: 0, ruleChecks: 0, suspiciousFound: 0 };
    }
}
