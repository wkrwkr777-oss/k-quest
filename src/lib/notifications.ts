// 알림 시스템
import { supabase } from './supabase';

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

export type NotificationType =
    | 'quest_accepted'
    | 'quest_completed'
    | 'new_application'
    | 'application_accepted'
    | 'application_rejected'
    | 'new_message'
    | 'payment_received'
    | 'payment_sent'
    | 'withdrawal_completed'
    | 'review_received'
    | 'warning'
    | 'ban'
    | 'quest_approved'
    | 'quest_rejected'
    | 'info'
    | 'success';

/**
 * 알림 생성
 */
export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string
): Promise<void> {
    try {
        const { error } = await supabase.from('notifications').insert({
            user_id: userId,
            type,
            title,
            message,
            link,
        });

        if (error) throw error;

        // 브라우저 푸시 알림 (권한이 있는 경우)
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/icon-512x512.png',
                badge: '/icon-192x192.png',
            });
        }
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
}

/**
 * 사용자의 알림 목록 가져오기
 */
export async function getNotifications(
    userId: string,
    limit = 50
): Promise<Notification[]> {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return [];
    }
}

/**
 * 안 읽은 알림 개수
 */
export async function getUnreadCount(userId: string): Promise<number> {
    try {
        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('Failed to fetch unread count:', error);
        return 0;
    }
}

/**
 * 알림 읽음 처리
 */
export async function markAsRead(notificationId: string): Promise<void> {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        if (error) throw error;
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
    }
}

/**
 * 모든 알림 읽음 처리
 */
export async function markAllAsRead(userId: string): Promise<void> {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) throw error;
    } catch (error) {
        console.error('Failed to mark all as read:', error);
    }
}

/**
 * 실시간 알림 구독
 */
export function subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
) {
    const channel = supabase
        .channel('notifications')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`,
            },
            (payload: { new: { [key: string]: any } }) => {
                callback(payload.new as Notification);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

/**
 * 브라우저 푸시 알림 권한 요청
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

// 알림 타입별 기본 메시지
export const NOTIFICATION_MESSAGES = {
    ko: {
        quest_accepted: {
            title: 'Quest 수락됨',
            message: '귀하의 Quest가 수행자에 의해 수락되었습니다.',
        },
        quest_completed: {
            title: 'Quest 완료',
            message: 'Quest가 성공적으로 완료되었습니다.',
        },
        new_application: {
            title: '새 지원자',
            message: '귀하의 Quest에 새로운 지원자가 있습니다.',
        },
        application_accepted: {
            title: '지원 수락됨',
            message: '귀하의 Quest 지원이 수락되었습니다!',
        },
        application_rejected: {
            title: '지원 거절됨',
            message: '귀하의 Quest 지원이 거절되었습니다.',
        },
        new_message: {
            title: '새 메시지',
            message: '새로운 메시지가 도착했습니다.',
        },
        payment_received: {
            title: '결제 완료',
            message: '결제가 성공적으로 완료되었습니다.',
        },
        payment_sent: {
            title: '송금 완료',
            message: '송금이 성공적으로 완료되었습니다.',
        },
        withdrawal_completed: {
            title: '출금 완료',
            message: '출금이 성공적으로 처리되었습니다.',
        },
        review_received: {
            title: '새 리뷰',
            message: '새로운 리뷰가 등록되었습니다.',
        },
        warning: {
            title: '⚠️ 경고',
            message: '플랫폼 정책 위반이 감지되었습니다.',
        },
        ban: {
            title: '🚫 계정 정지',
            message: '귀하의 계정이 정지되었습니다.',
        },
        quest_approved: {
            title: '✅ Quest 승인됨',
            message: '귀하의 Quest가 승인되어 공개되었습니다.',
        },
        quest_rejected: {
            title: '❌ Quest 거절됨',
            message: '귀하의 Quest가 거절되었습니다. 자세한 내용을 확인하세요.',
        },
    },
    en: {
        quest_accepted: {
            title: 'Quest Accepted',
            message: 'Your Quest has been accepted by a performer.',
        },
        quest_completed: {
            title: 'Quest Completed',
            message: 'Quest has been successfully completed.',
        },
        new_application: {
            title: 'New Application',
            message: 'You have a new applicant for your Quest.',
        },
        application_accepted: {
            title: 'Application Accepted',
            message: 'Your Quest application has been accepted!',
        },
        application_rejected: {
            title: 'Application Rejected',
            message: 'Your Quest application has been rejected.',
        },
        new_message: {
            title: 'New Message',
            message: 'You have a new message.',
        },
        payment_received: {
            title: 'Payment Received',
            message: 'Payment has been successfully received.',
        },
        payment_sent: {
            title: 'Payment Sent',
            message: 'Payment has been successfully sent.',
        },
        withdrawal_completed: {
            title: 'Withdrawal Completed',
            message: 'Your withdrawal has been processed.',
        },
        review_received: {
            title: 'New Review',
            message: 'You have received a new review.',
        },
        warning: {
            title: '⚠️ Warning',
            message: 'Policy violation detected.',
        },
        ban: {
            title: '🚫 Account Suspended',
            message: 'Your account has been suspended.',
        },
        quest_approved: {
            title: '✅ Quest Approved',
            message: 'Your Quest has been approved and published.',
        },
        quest_rejected: {
            title: '❌ Quest Rejected',
            message: 'Your Quest has been rejected. Please check details.',
        },
    },
};
