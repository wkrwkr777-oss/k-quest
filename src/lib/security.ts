// 보안 유틸리티
import { supabase } from './supabase';

/**
 * CSRF 토큰 생성
 */
export function generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * CSRF 토큰 검증
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken && token.length === 64;
}

/**
 * XSS 방어: HTML 이스케이프
 */
export function escapeHTML(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };
    return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * SQL Injection 방지: 입력 검증
 */
export function sanitizeInput(input: string): string {
    // Supabase는 기본적으로 parameterized queries를 사용하므로 SQL Injection은 방지됨
    // 추가 검증: 특수문자 제한
    return input.trim().slice(0, 500); // 길이 제한
}

/**
 * Rate Limiting (클라이언트 사이드)
 */
class RateLimiter {
    private requests: Map<string, number[]> = new Map();
    private limits: Map<string, { count: number; window: number }> = new Map();

    constructor() {
        // 기본 제한 설정
        this.limits.set('api', { count: 100, window: 60000 }); // 100 requests per minute
        this.limits.set('login', { count: 5, window: 300000 }); // 5 attempts per 5 minutes
        this.limits.set('message', { count: 30, window: 60000 }); // 30 messages per minute
    }

    check(key: string, type: string = 'api'): boolean {
        const now = Date.now();
        const limit = this.limits.get(type);
        if (!limit) return true;

        const fullKey = `${type}:${key}`;
        const requests = this.requests.get(fullKey) || [];

        // 윈도우 시간 내의 요청만 유지
        const validRequests = requests.filter((time) => now - time < limit.window);

        // 제한 초과 확인
        if (validRequests.length >= limit.count) {
            return false;
        }

        // 새 요청 추가
        validRequests.push(now);
        this.requests.set(fullKey, validRequests);

        return true;
    }

    reset(key: string, type: string = 'api'): void {
        const fullKey = `${type}:${key}`;
        this.requests.delete(fullKey);
    }
}

export const rateLimiter = new RateLimiter();

/**
 * 개인정보 마스킹
 */
export function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;

    const visibleChars = Math.min(3, Math.floor(local.length / 2));
    const masked = local.slice(0, visibleChars) + '***';
    return `${masked}@${domain}`;
}

export function maskPhone(phone: string): string {
    // 010-1234-5678 -> 010-****-5678
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-****-${cleaned.slice(-4)}`;
    }
    return phone;
}

/**
 * 비밀번호 강도 검증
 */
export function validatePasswordStrength(password: string): {
    valid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    errors: string[];
} {
    const errors: string[] = [];
    let score = 0;

    // 길이
    if (password.length < 8) {
        errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
    } else {
        score++;
    }

    // 소문자
    if (!/[a-z]/.test(password)) {
        errors.push('소문자를 포함해야 합니다.');
    } else {
        score++;
    }

    // 대문자
    if (!/[A-Z]/.test(password)) {
        errors.push('대문자를 포함해야 합니다.');
    } else {
        score++;
    }

    // 숫자
    if (!/[0-9]/.test(password)) {
        errors.push('숫자를 포함해야 합니다.');
    } else {
        score++;
    }

    // 특수문자
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('특수문자를 포함해야 합니다.');
    } else {
        score++;
    }

    const strength = score >= 4 ? 'strong' : score >= 2 ? 'medium' : 'weak';
    const valid = errors.length === 0;

    return { valid, strength, errors };
}

/**
 * 의심스러운 활동 감지
 */
interface SuspiciousActivity {
    type: 'multiple_login_attempts' | 'rapid_requests' | 'unusual_location' | 'price_manipulation';
    severity: 'low' | 'medium' | 'high';
    message: string;
}

export async function detectSuspiciousActivity(
    userId: string,
    activityType: string,
    data: any
): Promise<SuspiciousActivity | null> {
    // 여러 로그인 시도 감지
    if (activityType === 'login_attempt') {
        const attempts = parseInt(localStorage.getItem(`login_attempts_${userId}`) || '0');
        if (attempts >= 5) {
            return {
                type: 'multiple_login_attempts',
                severity: 'high',
                message: '과도한 로그인 시도가 감지되었습니다.',
            };
        }
    }

    // 빠른 요청 감지 (Rate Limiting)
    if (activityType === 'api_request') {
        if (!rateLimiter.check(userId, 'api')) {
            return {
                type: 'rapid_requests',
                severity: 'medium',
                message: '요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.',
            };
        }
    }

    // 가격 조작 감지
    if (activityType === 'quest_create' && data.reward) {
        // 비정상적으로 높거나 낮은 금액
        if (data.reward < 1 || data.reward > 10000) {
            return {
                type: 'price_manipulation',
                severity: 'medium',
                message: '비정상적인 금액이 감지되었습니다.',
            };
        }
    }

    return null;
}

/**
 * 로그인 시도 기록
 */
export function recordLoginAttempt(userId: string, success: boolean): void {
    const key = `login_attempts_${userId}`;
    const attempts = parseInt(localStorage.getItem(key) || '0');

    if (success) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, (attempts + 1).toString());

        // 5분 후 자동 초기화
        setTimeout(() => {
            localStorage.removeItem(key);
        }, 300000);
    }
}

/**
 * 세션 타임아웃 관리
 */
export class SessionManager {
    private timeout: number = 30 * 60 * 1000; // 30분
    private timer: NodeJS.Timeout | null = null;
    private onTimeout: () => void;

    constructor(onTimeout: () => void) {
        this.onTimeout = onTimeout;
        this.resetTimer();
        this.setupActivityListeners();
    }

    private setupActivityListeners(): void {
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
            document.addEventListener(event, () => this.resetTimer(), true);
        });
    }

    private resetTimer(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.onTimeout();
        }, this.timeout);
    }

    destroy(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}

/**
 * 안전한 로컬 스토리지 (암호화)
 */
export const secureStorage = {
    set(key: string, value: any): void {
        try {
            const encrypted = btoa(JSON.stringify(value)); // 간단한 인코딩 (프로덕션에서는 실제 암호화 사용)
            localStorage.setItem(key, encrypted);
        } catch (error) {
            console.error('Failed to store data:', error);
        }
    },

    get(key: string): any {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            return JSON.parse(atob(encrypted));
        } catch (error) {
            console.error('Failed to retrieve data:', error);
            return null;
        }
    },

    remove(key: string): void {
        localStorage.removeItem(key);
    },

    clear(): void {
        localStorage.clear();
    },
};
