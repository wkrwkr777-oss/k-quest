/**
 * K-Quest 에러 추적 시스템
 * 오류 발생 시 자동으로 DB에 저장하고 관리자에게 알림을 보냅니다.
 */

import { supabaseAdmin } from './supabase'

export interface ErrorLog {
    message: string
    stack?: string
    url?: string
    userId?: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    metadata?: any
}

export async function logError(error: ErrorLog) {
    try {
        // 1. DB에 에러 로그 저장
        const { error: dbError } = await supabaseAdmin
            .from('error_logs')
            .insert({
                message: error.message,
                stack: error.stack,
                url: error.url,
                user_id: error.userId,
                severity: error.severity,
                metadata: error.metadata,
                created_at: new Date().toISOString()
            })

        if (dbError) {
            console.error('Failed to log error to DB:', dbError)
        }

        // 2. Critical 에러는 즉시 알림 (실제로는 이메일/슬랙 웹훅 전송)
        if (error.severity === 'critical') {
            console.error('🚨 CRITICAL ERROR DETECTED:', error.message)
            // TODO: 이메일이나 슬랙 웹훅으로 관리자에게 알림
            // await sendSlackNotification(error)
        }

        // 3. 콘솔에도 출력 (개발 중 디버깅용)
        console.error('[Error Logger]', {
            severity: error.severity,
            message: error.message,
            url: error.url,
        })
    } catch (loggingError) {
        // 에러 로깅 자체가 실패해도 앱은 계속 돌아가야 함
        console.error('Error logging failed:', loggingError)
    }
}

// React 컴포넌트에서 사용할 수 있는 에러 바운더리 훅
export function useErrorHandler() {
    const handleError = (error: Error, errorInfo?: any) => {
        logError({
            message: error.message,
            stack: error.stack,
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            severity: 'high',
            metadata: errorInfo
        })
    }

    return { handleError }
}
