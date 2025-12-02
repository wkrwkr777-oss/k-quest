/**
 * Web Push 알림 시스템
 * 퀘스트 등록, 지원, 메시지 등의 이벤트 발생 시 사용자에게 알림을 보냅니다.
 */

export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications.')
        return false
    }

    if (Notification.permission === 'granted') {
        return true
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
    }

    return false
}

export interface PushNotification {
    title: string
    body: string
    icon?: string
    badge?: string
    data?: any
}

export async function sendPushNotification(notification: PushNotification) {
    if (Notification.permission !== 'granted') {
        console.log('Notification permission not granted')
        return
    }

    try {
        const notif = new Notification(notification.title, {
            body: notification.body,
            icon: notification.icon || '/icons/icon-192x192.png',
            badge: notification.badge || '/icons/icon-192x192.png',
            data: notification.data,
            tag: 'k-quest-notification',
            requireInteraction: false, // 자동으로 사라짐
        })

        // 클릭 시 앱으로 이동
        notif.onclick = () => {
            window.focus()
            if (notification.data?.url) {
                window.location.href = notification.data.url
            }
            notif.close()
        }
    } catch (error) {
        console.error('Failed to send push notification:', error)
    }
}

// 사용 예시:
// sendPushNotification({
//     title: '새로운 퀘스트!',
//     body: '홍대에서 맛집 줄 서기 ($50)',
//     data: { url: '/quests/123' }
// })
