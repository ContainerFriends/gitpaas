import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useBreadcrumbContext } from '../contexts/BreadcrumbContext';

export interface BreadcrumbItem {
    label: string;
    path: string;
    isLast?: boolean;
}

/**
 * Hook to generate breadcrumbs based on current route and params
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
    const location = useLocation();
    const params = useParams();
    const { metadata } = useBreadcrumbContext();

    return useMemo(() => {
        const breadcrumbs: BreadcrumbItem[] = [];
        const segments = location.pathname.split('/').filter(Boolean);

        // Always start with Dashboard
        if (location.pathname !== '/') {
            breadcrumbs.push({
                label: 'Dashboard',
                path: '/',
            });
        }

        // Build breadcrumbs based on path segments
        let currentPath = '';
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;

            let label = segment;

            // Handle specific routes
            switch (segment) {
                case 'projects':
                    label = 'Projects';
                    break;
                case 'services':
                    label = 'Services';
                    break;
                case 'networks':
                    label = 'Networks';
                    break;
                default:
                    // Handle dynamic segments
                    if (metadata[segment]) {
                        label = metadata[segment];
                    } else if (params.projectId && segment === params.projectId) {
                        label = `Project ${segment}`;
                    } else if (params.serviceId && segment === params.serviceId) {
                        label = `Service ${segment}`;
                    } else {
                        label = segment.charAt(0).toUpperCase() + segment.slice(1);
                    }
            }

            breadcrumbs.push({
                label,
                path: currentPath,
                isLast,
            });
        });

        // If we're on the home page
        if (breadcrumbs.length === 0) {
            breadcrumbs.push({
                label: 'Dashboard',
                path: '/',
                isLast: true,
            });
        }

        return breadcrumbs;
    }, [location.pathname, params, metadata]);
}
