/**
 * API Rate Limiting (속도 제한)
 * 같은 IP에서 너무 많은 요청이 오면 차단합니다.
 */

interface RateLimitStore {
    [ip: string]: {
        count: number
        resetAt: number
    }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
    maxRequests: number // 허용 요청 수
    windowMs: number // 시간 창 (밀리초)
}

// 기본 설정: 1분에 20번
const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 20,
    windowMs: 60 * 1000 // 1분
}

export function rateLimit(ip: string, config: RateLimitConfig = DEFAULT_CONFIG): { allowed: boolean, remaining: number } {
    const now = Date.now()

    // IP가 처음 요청하는 경우
    if (!store[ip]) {
        store[ip] = {
            count: 1,
            resetAt: now + config.windowMs
        }
        return { allowed: true, remaining: config.maxRequests - 1 }
    }

    // 시간 창이 지났으면 리셋
    if (now > store[ip].resetAt) {
        store[ip] = {
            count: 1,
            resetAt: now + config.windowMs
        }
        return { allowed: true, remaining: config.maxRequests - 1 }
    }

    // 요청 수 증가
    store[ip].count++

    // 제한 초과 여부 확인
    if (store[ip].count > config.maxRequests) {
        return { allowed: false, remaining: 0 }
    }

    return { allowed: true, remaining: config.maxRequests - store[ip].count }
}

// 주기적으로 오래된 데이터 삭제 (메모리 누수 방지)
setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach(ip => {
        if (now > store[ip].resetAt + 60000) { // 1분 이상 지난 데이터
            delete store[ip]
        }
    })
}, 5 * 60 * 1000) // 5분마다 정리
