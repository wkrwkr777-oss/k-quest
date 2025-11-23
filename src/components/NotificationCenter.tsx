"use client";

import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    subscribeToNotifications,
    Notification,
} from '@/lib/notifications';
import Link from 'next/link';

export function NotificationCenter() {
    const { user } = useStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        loadNotifications();
        loadUnreadCount();

        // 실시간 구독
        const unsubscribe = subscribeToNotifications(user.id, (newNotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // 사운드  효과 (선택사항)
            playNotificationSound();
        });

        return unsubscribe;
    }, [user]);

    const loadNotifications = async () => {
        if (!user) return;
        setIsLoading(true);
        const data = await getNotifications(user.id);
        setNotifications(data);
        setIsLoading(false);
    };

    const loadUnreadCount = async () => {
        if (!user) return;
        const count = await getUnreadCount(user.id);
        setUnreadCount(count);
    };

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleMarkAllAsRead = async () => {
        if (!user) return;
        await markAllAsRead(user.id);
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    const playNotificationSound = () => {
        // 간단한 beep 소리 (선택사항)
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUYrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OyhURALTKXk7bllHAU2jNby0H4u');
        audio.volume = 0.3;
        audio.play().catch(() => { });
    };

    const getNotificationIcon = (type: string) => {
        const icons: Record<string, string> = {
            quest_accepted: '✅',
            quest_completed: '🎉',
            new_application: '📝',
            application_accepted: '👍',
            application_rejected: '👎',
            new_message: '💬',
            payment_received: '💰',
            payment_sent: '📤',
            withdrawal_completed: '💳',
            review_received: '⭐',
            warning: '⚠️',
            ban: '🚫',
            quest_approved: '✅',
            quest_rejected: '❌',
        };
        return icons[type] || '🔔';
    };

    if (!user) return null;

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-[#262626] rounded-full transition-colors"
            >
                <Bell className="w-6 h-6 text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 mt-2 w-96 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-2xl z-50 max-h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-[#333] flex items-center justify-between sticky top-0 bg-[#1A1A1A]">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Bell className="w-5 h-5 text-[#D4AF37]" />
                                알림 {unreadCount > 0 && `(${unreadCount})`}
                            </h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-[#D4AF37] hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        <CheckCheck className="w-4 h-4" />
                                        모두 읽음
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {isLoading ? (
                                <div className="p-8 text-center text-gray-400">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">알림이 없습니다</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#333]">
                                    {notifications.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onMarkAsRead={handleMarkAsRead}
                                            getIcon={getNotificationIcon}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    getIcon: (type: string) => string;
}

function NotificationItem({
    notification,
    onMarkAsRead,
    getIcon,
}: NotificationItemProps) {
    const content = (
        <div
            className={`p-4 hover:bg-[#262626] transition-colors cursor-pointer ${!notification.is_read ? 'bg-[#111]' : ''
                }`}
            onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">
                    {getIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="text-white font-medium text-sm">
                            {notification.title}
                        </h4>
                        {!notification.is_read && (
                            <span className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0 mt-1"></span>
                        )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                        {formatTimestamp(notification.created_at)}
                    </p>
                </div>
            </div>
        </div>
    );

    if (notification.link) {
        return (
            <Link href={notification.link} onClick={() => onMarkAsRead(notification.id)}>
                {content}
            </Link>
        );
    }

    return content;
}

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
