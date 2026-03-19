import { createContext, useContext, useCallback, ReactNode, useReducer } from 'react';

type NotificationVariant = 'default' | 'destructive' | 'success' | 'warning';

interface Notification {
    id: string;
    title: string;
    description?: string;
    variant: NotificationVariant;
}

interface NotificationContextValue {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}

type NotificationAction = { type: 'ADD'; notification: Notification } | { type: 'REMOVE'; id: string } | { type: 'CLEAR' };

let notificationCount = 0;

function notificationReducer(state: Notification[], action: NotificationAction): Notification[] {
    switch (action.type) {
        case 'ADD':
            return [...state, action.notification];
        case 'REMOVE':
            return state.filter((n) => n.id !== action.id);
        case 'CLEAR':
            return [];
    }
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

/**
 * Provider for notifications
 */
export function NotificationProvider({ children }: { children: ReactNode }): ReactNode {
    const [notifications, dispatch] = useReducer(notificationReducer, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        notificationCount = (notificationCount + 1) % Number.MAX_SAFE_INTEGER;
        const id = `notification-${notificationCount.toString()}`;
        dispatch({ type: 'ADD', notification: { ...notification, id } });
    }, []);

    const removeNotification = useCallback((id: string) => {
        dispatch({ type: 'REMOVE', id });
    }, []);

    const clearNotifications = useCallback(() => {
        dispatch({ type: 'CLEAR' });
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

/**
 * Hook to access the notification context
 */
export function useNotificationContext(): NotificationContextValue {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
}
