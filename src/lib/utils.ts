import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 직거래 방지 필터링 시스템 (비용 0원)
 * 채팅 메시지나 게시글에서 연락처 교환 시도를 감지합니다.
 */
export const AntiFraud = {
    // 금지 패턴 정의
    patterns: {
        phone: /(01[016789]|02|0[3-9][0-9])[\s.-]?([0-9]{3,4})[\s.-]?([0-9]{4})/g,
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        sns: /(카톡|카카오|kakao|라인|line|텔레|tele|위챗|wechat|인스타|insta)\s*[:ID아이디]?\s*([a-zA-Z0-9_]+)/gi,
        account: /([0-9]{10,14})|(\d{3,}-\d{2,}-\d{3,})/g // 계좌번호 추정
    },

    /**
     * 메시지에 금지된 내용이 있는지 검사합니다.
     * @returns 감지된 금지어 타입 (없으면 null)
     */
    detect: (text: string): 'phone' | 'email' | 'sns' | 'account' | null => {
        if (AntiFraud.patterns.phone.test(text)) return 'phone';
        if (AntiFraud.patterns.email.test(text)) return 'email';
        if (AntiFraud.patterns.sns.test(text)) return 'sns';
        if (AntiFraud.patterns.account.test(text)) return 'account';
        return null;
    },

    /**
     * 메시지에서 금지된 내용을 마스킹(***) 처리합니다.
     */
    mask: (text: string): string => {
        let masked = text;
        masked = masked.replace(AntiFraud.patterns.phone, '***-****-**** (보안)');
        masked = masked.replace(AntiFraud.patterns.email, '*****@***.** (보안)');
        masked = masked.replace(AntiFraud.patterns.sns, '$1 *** (보안)');
        masked = masked.replace(AntiFraud.patterns.account, '****-**** (보안)');
        return masked;
    },

    /**
     * 경고 메시지 반환
     */
    getWarningMessage: (type: 'phone' | 'email' | 'sns' | 'account'): string => {
        switch (type) {
            case 'phone':
                return "🚫 전화번호 공유는 금지되어 있습니다. 앱 내 채팅을 이용해주세요.";
            case 'email':
                return "🚫 이메일 공유는 금지되어 있습니다.";
            case 'sns':
                return "🚫 외부 메신저(카톡 등) 유도는 제재 대상입니다.";
            case 'account':
                return "🚫 계좌번호 공유는 위험합니다. 안전결제를 이용해주세요.";
            default:
                return "";
        }
    }
};
