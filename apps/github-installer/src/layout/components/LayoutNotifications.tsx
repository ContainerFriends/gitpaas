import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { ReactNode } from 'react';

import { useNotificationContext } from '../contexts/NotificationContext';

import { Alert, AlertTitle, AlertDescription } from '@shared/components/Alert';

const VARIANT_ICONS = {
    default: Info,
    destructive: AlertCircle,
    success: CheckCircle2,
    warning: AlertTriangle,
} as const;

const VARIANT_STYLES = {
    default: '',
    destructive: '',
    success: 'border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-600',
    warning: 'border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-600',
} as const;

/**
 * Notifications component.
 */
export function LayoutNotifications(): ReactNode {
    const { notifications, removeNotification } = useNotificationContext();

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2 px-6 pt-4">
            {notifications.map((notification) => {
                const Icon = VARIANT_ICONS[notification.variant];
                const alertVariant = notification.variant === 'destructive' ? 'destructive' : 'default';

                return (
                    <Alert key={notification.id} variant={alertVariant} className={VARIANT_STYLES[notification.variant]}>
                        <Icon className="h-4 w-4" />
                        <AlertTitle className="flex items-center justify-between">
                            {notification.title}
                            <button
                                onClick={() => {
                                    removeNotification(notification.id);
                                }}
                                className="ml-auto -mr-1 -mt-1 h-5 w-5 rounded-md inline-flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </AlertTitle>
                        {notification.description && <AlertDescription>{notification.description}</AlertDescription>}
                    </Alert>
                );
            })}
        </div>
    );
}
