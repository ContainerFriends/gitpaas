import { useCallback } from 'react';

import { useNotificationContext } from '../contexts/NotificationContext';

type NotificationVariant = 'default' | 'destructive' | 'success' | 'warning';

interface UseNotificationsReturn {
    notifications: Array<{ id: string; title: string; description?: string; variant: NotificationVariant }>;
    notify: (title: string, options?: { description?: string; variant?: NotificationVariant }) => void;
    remove: (id: string) => void;
    clear: () => void;
}

/**
 * Hook to manage notifications
 */
export function useNotifications(): UseNotificationsReturn {
    const { notifications, addNotification, removeNotification, clearNotifications } = useNotificationContext();

    const notify = useCallback(
        (title: string, options?: { description?: string; variant?: NotificationVariant }) => {
            addNotification({
                title,
                description: options?.description,
                variant: options?.variant ?? 'default',
            });
        },
        [addNotification],
    );

    return {
        notifications,
        notify,
        remove: removeNotification,
        clear: clearNotifications,
    };
}
