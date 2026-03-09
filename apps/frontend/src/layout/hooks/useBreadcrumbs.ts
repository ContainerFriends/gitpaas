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
            let linkPath = currentPath;
            let shouldAddBreadcrumb = true;

            // Handle specific routes
            switch (segment) {
                case 'projects':
                    label = 'Projects';
                    break;
                case 'services':
                    // Skip "services" breadcrumb if it's directly after a project ID
                    // This covers both /projects/{id}/services and /projects/{id}/services/{serviceId}
                    const previousSegment = segments[index - 1];
                    if (params.projectId && previousSegment === params.projectId) {
                        shouldAddBreadcrumb = false;
                    } else {
                        label = 'Services';
                    }
                    break;
                case 'networks':
                    label = 'Networks';
                    break;
                default:
                    // Handle dynamic segments
                    if (metadata[segment]) {
                        label = metadata[segment];

                        // Special case: if this is a project ID and we have services in the path,
                        // but services is the last segment, keep the link to current path (no /services)
                        if (params.projectId && segment === params.projectId) {
                            const hasServicesAfter = segments.slice(index + 1).includes('services');
                            const servicesIsLast = segments[segments.length - 1] === 'services';
                            if (hasServicesAfter && !servicesIsLast) {
                                linkPath = `${currentPath}/services`;
                            }
                        }
                    } else if (params.projectId && segment === params.projectId) {
                        label = `Project ${segment}`;

                        // Special case: if we have services in the path,
                        // but services is the last segment, keep the link to current path (no /services)
                        const hasServicesAfter = segments.slice(index + 1).includes('services');
                        const servicesIsLast = segments[segments.length - 1] === 'services';
                        if (hasServicesAfter && !servicesIsLast) {
                            linkPath = `${currentPath}/services`;
                        }
                    } else if (params.serviceId && segment === params.serviceId) {
                        label = `Service ${segment}`;
                    } else {
                        label = segment.charAt(0).toUpperCase() + segment.slice(1);
                    }
            }

            // Only add breadcrumb if shouldAddBreadcrumb is true
            if (shouldAddBreadcrumb) {
                breadcrumbs.push({
                    label,
                    path: linkPath,
                    isLast,
                });
            }
        });

        // Fix isLast property: ensure the last breadcrumb in the array is marked as last
        if (breadcrumbs.length > 0) {
            breadcrumbs.forEach((breadcrumb, index) => {
                breadcrumb.isLast = index === breadcrumbs.length - 1;
            });
        }

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
