// 직거래 방지 채팅 필터 시스템
// 연락처, 금융 정보, 욕설 등을 자동으로 감지하고 차단합니다

export interface FilterResult {
    filtered: string;
    isViolation: boolean;
    violationType: string | null;
    severity: 'low' | 'medium' | 'high' | 'critical' | null;
    matchedPattern: string | null;
}

// 직거래 유도 패턴 (한국어 + 영어)
const CONTACT_PATTERNS = [
    // 전화번호
    /\b0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}\b/g, // 010-1234-5678, 02-123-4567
    /\b\d{3}[-\s]?\d{3,4}[-\s]?\d{4}\b/g,
    /\b01[0-9][-\s.]?\d{4}[-\s.]?\d{4}\b/g,
    /(\+82|82)[-\s]?1[0-9][-\s]?\d{4}[-\s]?\d{4}/g,

    // 이메일
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

    // SNS ID
    /카카오톡?\s*[:：]?\s*[\w가-힣]+/gi,
    /카톡\s*[:：]?\s*[\w가-힣]+/gi,
    /텔레그램\s*[:：]?\s*[\w가-힣@]+/gi,
    /인스타\s*[:：]?\s*[@]?[\w.]+/gi,
    /라인\s*[:：]?\s*[\w가-힣]+/gi,
    /위챗\s*[:：]?\s*[\w가-힣]+/gi,
    /kakao\s*[:：]?\s*[\w가-힣]+/gi,
    /telegram\s*[:：]?\s*[@]?[\w]+/gi,
    /instagram\s*[:：]?\s*[@]?[\w.]+/gi,
    /line\s*[:：]?\s*[\w가-힣]+/gi,
    /wechat\s*[:：]?\s*[\w가-힣]+/gi,
    /@[\w가-힣]+/g, // @로 시작하는 ID

    // URL
    /https?:\/\/[^\s]+/gi,
    /www\.[^\s]+/gi,
    /[a-zA-Z0-9-]+\.(com|net|org|co\.kr|kr|io|me)[^\s]*/gi,
];

// 금융 정보 패턴
const FINANCIAL_PATTERNS = [
    // 계좌번호
    /\b\d{3}[-\s]?\d{2,6}[-\s]?\d{4,8}\b/g,
    /계좌\s*[:：]?\s*\d+/gi,
    /통장\s*[:：]?\s*\d+/gi,
    /계좌번호\s*[:：]?\s*\d+/gi,

    // 직거래 유도 문구
    /직거래|직접\s*거래|직접\s*만나|따로\s*연락|개인\s*연락/gi,
    /수수료\s*아껴|수수료\s*없이|수수료\s*빼고/gi,
    /플랫폼\s*통하지\s*말|여기\s*말고|다른\s*곳에서/gi,
    /현금\s*직접|현금\s*거래/gi,

    // 가격 협상 (플랫폼 외부에서)
    /\d+만원\s*(더|덜|깎|추가|플러스)/gi,
    /돈\s*(더|덜)\s*주/gi,
];

// 욕설 및 부적절한 언어
const OFFENSIVE_PATTERNS = [
    /시발|씨발|ㅅㅂ|병신|ㅂㅅ|개새끼|ㄱㅅㄲ/gi,
    /fuck|shit|bitch|asshole/gi,
];

// 의심스러운 숫자 패턴 (단독으로는 차단 안 함, 플래깅만)
const SUSPICIOUS_NUMBER_PATTERNS = [
    /\b\d{10,}\b/g, // 10자리 이상 연속된 숫자
];

/**
 * 메시지를 필터링하고 위반 여부를 판단합니다
 */
export function filterChatMessage(message: string): FilterResult {
    let filtered = message;
    let isViolation = false;
    let violationType: string | null = null;
    let severity: FilterResult['severity'] = null;
    let matchedPattern: string | null = null;

    // 1. 연락처 정보 차단 (CRITICAL)
    for (const pattern of CONTACT_PATTERNS) {
        if (pattern.test(message)) {
            filtered = filtered.replace(pattern, '***');
            isViolation = true;
            violationType = 'contact_info';
            severity = 'critical';
            matchedPattern = pattern.toString();
            break;
        }
    }

    // 2. 금융 정보 및 직거래 유도 차단 (HIGH)
    if (!isViolation) {
        for (const pattern of FINANCIAL_PATTERNS) {
            if (pattern.test(message)) {
                filtered = filtered.replace(pattern, '***');
                isViolation = true;
                violationType = 'price_negotiation';
                severity = 'high';
                matchedPattern = pattern.toString();
                break;
            }
        }
    }

    // 3. 욕설 및 부적절한 언어 차단 (MEDIUM)
    if (!isViolation) {
        for (const pattern of OFFENSIVE_PATTERNS) {
            if (pattern.test(message)) {
                filtered = filtered.replace(pattern, '***');
                isViolation = true;
                violationType = 'offensive';
                severity = 'medium';
                matchedPattern = pattern.toString();
                break;
            }
        }
    }

    // 4. 의심스러운 패턴 (플래깅만, 차단 안 함) (LOW)
    if (!isViolation) {
        for (const pattern of SUSPICIOUS_NUMBER_PATTERNS) {
            if (pattern.test(message)) {
                isViolation = true;
                violationType = 'suspicious_pattern';
                severity = 'low';
                matchedPattern = pattern.toString();
                // 메시지는 그대로 유지, 관리자 리뷰용으로만 플래깅
                break;
            }
        }
    }

    return {
        filtered,
        isViolation,
        violationType,
        severity,
        matchedPattern,
    };
}

/**
 * 메시지가 안전한지 확인 (true = 안전, false = 차단)
 */
export function isSafeMessage(message: string): boolean {
    const result = filterChatMessage(message);
    // severity가 'low'(의심)만 있으면 통과, medium 이상은 차단
    return !result.isViolation || result.severity === 'low';
}

/**
 * 위반 횟수에 따른 조치 결정
 */
export function determineAction(warningCount: number): string {
    if (warningCount >= 5) {
        return 'permanent_ban';
    } else if (warningCount >= 3) {
        return 'temp_ban';
    } else if (warningCount >= 1) {
        return 'warning';
    }
    return 'none';
}

/**
 * 경고 메시지 생성
 */
export function getWarningMessage(severity: string, violationType: string): string {
    const messages = {
        critical: {
            contact_info: '⛔ 연락처 공유는 금지되어 있습니다. 모든 거래는 K-Quest 플랫폼 내에서 진행해야 합니다.',
        },
        high: {
            price_negotiation: '⚠️ 플랫폼 외부 거래 유도는 금지되어 있습니다. 위반 시 계정이 정지될 수 있습니다.',
        },
        medium: {
            offensive: '⚠️ 부적절한 언어 사용은 금지되어 있습니다.',
        },
        low: {
            suspicious_pattern: 'ℹ️ 메시지에 의심스러운 패턴이 감지되었습니다. 플랫폼 정책을 준수해주세요.',
        },
    };

    return (messages as any)[severity]?.[violationType]
        || '⚠️ 플랫폼 정책을 위반하는 메시지입니다.';
}

/**
 * Quest 관련 안전한 대화 템플릿 제공
 */
export const SAFE_MESSAGE_TEMPLATES = {
    ko: [
        '안녕하세요, Quest에 관심이 있습니다.',
        'Quest에 대해 더 자세히 알고 싶습니다.',
        '제가 이 Quest를 수행하기에 적합한 이유를 말씀드리겠습니다.',
        'Quest 세부사항에 대해 질문이 있습니다.',
        '언제까지 완료가 필요하신가요?',
        '필요한 준비물이 있나요?',
        '위치는 정확히 어디인가요?',
        '추가 요구사항이 있으신가요?',
    ],
    en: [
        'Hello, I\'m interested in this Quest.',
        'I\'d like to know more about the Quest details.',
        'I can explain why I\'m suitable for this Quest.',
        'I have some questions about the Quest specifics.',
        'When do you need this completed by?',
        'Are there any materials I need to prepare?',
        'What\'s the exact location?',
        'Are there any additional requirements?',
    ],
};
