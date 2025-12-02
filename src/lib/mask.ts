/**
 * 개인정보 마스킹 유틸리티
 * 화면에 노출되는 민감 정보를 자동으로 가립니다.
 */

export function maskName(name: string): string {
    if (!name || name.length < 2) return name

    // 예: "김철수" -> "김*수", "John Smith" -> "J*** S****"
    if (name.length === 2) {
        return name[0] + '*'
    } else if (name.length === 3) {
        return name[0] + '*' + name[2]
    } else {
        // 4글자 이상: 첫 글자와 마지막 글자만 표시
        return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
    }
}

export function maskPhone(phone: string): string {
    if (!phone) return ''

    // 숫자만 추출
    const numbers = phone.replace(/\D/g, '')

    if (numbers.length === 11) {
        // 010-1234-5678 -> 010-****-5678
        return numbers.slice(0, 3) + '-****-' + numbers.slice(7)
    } else if (numbers.length === 10) {
        // 02-1234-5678 -> 02-****-5678
        return numbers.slice(0, 2) + '-****-' + numbers.slice(6)
    }

    // 기타 형식은 뒷 4자리만 표시
    return '***-' + numbers.slice(-4)
}

export function maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email

    const [username, domain] = email.split('@')

    if (username.length <= 2) {
        return '*'.repeat(username.length) + '@' + domain
    }

    // 예: "john.doe@example.com" -> "jo****e@example.com"
    return username[0] + '*'.repeat(username.length - 2) + username[username.length - 1] + '@' + domain
}

export function maskBankAccount(account: string): string {
    if (!account) return ''

    const numbers = account.replace(/\D/g, '')

    if (numbers.length < 4) return '***'

    // 예: "110-123-456789" -> "110-***-**6789"
    return numbers.slice(0, 3) + '-***-**' + numbers.slice(-4)
}
