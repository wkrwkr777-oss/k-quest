/**
 * XSS (Cross-Site Scripting) 공격 방지 유틸리티
 * 사용자 입력값에서 위험한 HTML/스크립트를 제거합니다.
 */

export function sanitizeHTML(input: string): string {
    if (!input) return ''

    // 위험한 태그 제거
    let sanitized = input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // <script> 태그 제거
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // <iframe> 태그 제거
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // on* 이벤트 핸들러 제거 (onclick, onerror 등)
        .replace(/javascript:/gi, '') // javascript: 프로토콜 제거

    return sanitized
}

export function sanitizeText(input: string): string {
    if (!input) return ''

    // 순수 텍스트만 허용 (모든 HTML 제거)
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
}

export function sanitizeURL(url: string): string {
    if (!url) return ''

    // 안전한 프로토콜만 허용
    const safeProtocols = ['http:', 'https:', 'mailto:']
    try {
        const parsed = new URL(url)
        if (safeProtocols.includes(parsed.protocol)) {
            return url
        }
    } catch {
        // URL 파싱 실패 시 빈 문자열 반환
    }
    return ''
}
