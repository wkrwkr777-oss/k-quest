/**
 * K-Quest 직거래 방지 필터 (Anti-Circumvention)
 * 연락처, 메신저 ID, 계좌번호 등 개인정보 교환을 원천 차단합니다.
 */

interface FilterResult {
    isClean: boolean
    detectedType?: 'phone' | 'email' | 'messenger' | 'account' | 'keyword'
    warningMessage?: string
    maskedContent?: string
}

export const ANTI_FRAUD_PATTERNS = {
    // 전화번호 (010-1234-5678, 010 1234 5678, 공일공...)
    phone: /(01[016789]|공일[공영일이삼사오육칠팔구])[\s.-]*([0-9]{3,4}|[영일이삼사오육칠팔구]{3,4})[\s.-]*([0-9]{4}|[영일이삼사오육칠팔구]{4})/g,

    // 이메일
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

    // 메신저 키워드 (카톡, 라인, 텔레그램 등)
    messenger: /(카톡|카카오톡|kakao|talk|라인|line|텔레그램|telegram|위챗|wechat)\s*[:ID아이디]?\s*[a-zA-Z0-9]+/gi,

    // 계좌번호 (숫자가 10자리 이상 연속되거나 하이픈 포함)
    account: /([0-9]{3,6})[\s-]*([0-9]{2,6})[\s-]*([0-9]{2,6})/g,

    // 직거래 유도 키워드
    keywords: /(직거래|수수료|싸게|입금|계좌|송금|따로|밖에서|연락처|전번|폰번)/g
}

export function checkMessageSafety(content: string): FilterResult {
    // 1. 전화번호 체크
    if (ANTI_FRAUD_PATTERNS.phone.test(content)) {
        return {
            isClean: false,
            detectedType: 'phone',
            warningMessage: '⛔ 전화번호 공유는 금지되어 있습니다. 모든 소통은 K-Quest 내에서만 가능합니다.',
            maskedContent: content.replace(ANTI_FRAUD_PATTERNS.phone, '[전화번호 차단됨]')
        }
    }

    // 2. 이메일 체크
    if (ANTI_FRAUD_PATTERNS.email.test(content)) {
        return {
            isClean: false,
            detectedType: 'email',
            warningMessage: '⛔ 이메일 공유는 금지되어 있습니다.',
            maskedContent: content.replace(ANTI_FRAUD_PATTERNS.email, '[이메일 차단됨]')
        }
    }

    // 3. 메신저 ID 체크
    if (ANTI_FRAUD_PATTERNS.messenger.test(content)) {
        return {
            isClean: false,
            detectedType: 'messenger',
            warningMessage: '⛔ 외부 메신저(카톡, 라인 등) 유도는 영구 정지 사유입니다.',
            maskedContent: content.replace(ANTI_FRAUD_PATTERNS.messenger, '[메신저 ID 차단됨]')
        }
    }

    // 4. 계좌번호 체크 (엄격하게)
    // 숫자가 너무 많이 포함된 경우 의심
    const digitCount = (content.match(/\d/g) || []).length
    if (digitCount > 9 && ANTI_FRAUD_PATTERNS.account.test(content)) {
        return {
            isClean: false,
            detectedType: 'account',
            warningMessage: '⛔ 계좌번호 공유는 절대 금지입니다. 안전결제(에스크로)를 이용해주세요.',
            maskedContent: content.replace(ANTI_FRAUD_PATTERNS.account, '[계좌번호 차단됨]')
        }
    }

    // 5. 위험 키워드 체크
    if (ANTI_FRAUD_PATTERNS.keywords.test(content)) {
        return {
            isClean: false, // 키워드는 경고만 하고 전송은 허용할 수도 있지만, 여기서는 엄격하게 false 처리
            detectedType: 'keyword',
            warningMessage: '⚠️ 직거래 유도 의심 단어가 포함되어 있습니다. 직거래 적발 시 계정이 영구 정지됩니다.',
            maskedContent: content // 키워드는 마스킹하지 않고 경고만 줌 (문맥 파악 필요)
        }
    }

    return { isClean: true }
}
