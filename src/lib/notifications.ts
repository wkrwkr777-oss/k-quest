// ============================================
// 알림 시스템
// ============================================

import { supabase } from './supabase';

export type NotificationType =
    | 'quest_application'
    | 'quest_accepted'
    | 'quest_completed'
    | 'message_received'
    | 'review_received'
    | 'payment_received'
    | 'sos_alert'
    | 'admin_message';

/**
 * 알림 생성
 */
export async function createNotification(params: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
}): Promise<{ success: boolean }> {
    try {
        await supabase.from('notifications').insert({
            user_id: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            data: params.data || {},
            read: false
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to create notification:', error);
        return { success: false };
    }
}

/**
 * Quest 관련 자동 알림
 */

// Quest 신청 알림
export async function notifyQuestApplication(params: {
    questOwnerId: string;
    applicantName: string;
    questTitle: string;
    questId: string;
}) {
    return createNotification({
        userId: params.questOwnerId,
        type: 'quest_application',
        title: '🎯 새로운 Quest 신청!',
        message: `${params.applicantName}님이 "${params.questTitle}" Quest에 신청했습니다.`,
        data: { questId: params.questId }
    });
}

// Quest 수락 알림
export async function notifyQuestAccepted(params: {
    performerId: string;
    questTitle: string;
    questId: string;
}) {
    return createNotification({
        userId: params.performerId,
        type: 'quest_accepted',
        title: '🎉 Quest 신청 수락!',
        message: `"${params.questTitle}" Quest가 수락되었습니다! 이제 시작할 수 있습니다.`,
        data: { questId: params.questId }
    });
}

// Quest 완료 알림
export async function notifyQuestCompleted(params: {
    clientId: string;
    performerId: string;
    questTitle: string;
    questId: string;
}) {
    // 의뢰자에게
    await createNotification({
        userId: params.clientId,
        type: 'quest_completed',
        title: '✅ Quest 완료!',
        message: `"${params.questTitle}" Quest가 완료되었습니다. 리뷰를 작성해주세요!`,
        data: { questId: params.questId }
    });

    // 수행자에게
    await createNotification({
        userId: params.performerId,
        type: 'quest_completed',
        title: '💰 Quest 완료!',
        message: `"${params.questTitle}" Quest 완료! 정산이 진행됩니다.`,
        data: { questId: params.questId }
    });
}

// 결제 완료 알림
export async function notifyPaymentReceived(params: {
    userId: string;
    amount: number;
    questTitle: string;
}) {
    return createNotification({
        userId: params.userId,
        type: 'payment_received',
        title: '💵 결제 완료!',
        message: `"${params.questTitle}" - ${params.amount.toLocaleString()}원이 입금되었습니다.`,
        data: { amount: params.amount }
    });
}

// 리뷰 받음 알림
export async function notifyReviewReceived(params: {
    userId: string;
    reviewerName: string;
    rating: number;
    questTitle: string;
}) {
    const stars = '⭐'.repeat(params.rating);

    return createNotification({
        userId: params.userId,
        type: 'review_received',
        title: '⭐ 새로운 리뷰!',
        message: `${params.reviewerName}님이 "${params.questTitle}"에 ${stars} 리뷰를 남겼습니다.`,
        data: { rating: params.rating }
    });
}

// SOS 긴급 알림 (관리자에게)
export async function notifySOSAlert(params: {
    questId: string;
    reporterName: string;
    severity: string;
    message: string;
}) {
    // 모든 관리자에게 알림
    const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_admin', true);

    if (!admins) return;

    for (const admin of admins) {
        await createNotification({
            userId: admin.id,
            type: 'sos_alert',
            title: `🆘 긴급 SOS (${params.severity.toUpperCase()})!`,
            message: `${params.reporterName}: ${params.message}`,
            data: { questId: params.questId, severity: params.severity }
        });
    }
}

/**
 * 사용자 알림 조회
 */
export async function getUserNotifications(
    userId: string,
    limit = 20
): Promise<any[]> {
    try {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        return data || [];
    } catch (error) {
        console.error('Failed to get notifications:', error);
        return [];
    }
}

/**
 * 알림 읽음 처리
 */
export async function markNotificationAsRead(
    notificationId: string
): Promise<{ success: boolean }> {
    try {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

/**
 * 모든 알림 읽음 처리
 */
export async function markAllNotificationsAsRead(
    userId: string
): Promise<{ success: boolean }> {
    try {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);

        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

/**
 * 읽지 않은 알림 수
 */
export async function getUnreadCount(userId: string): Promise<number> {
    try {
        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);

        return count || 0;
    } catch (error) {
        return 0;
    }
}
