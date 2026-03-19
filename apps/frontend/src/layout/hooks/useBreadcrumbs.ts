import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useBreadcrumbContext } from '../contexts/BreadcrumbContext';

interface BreadcrumbItem {
    label: string;
    path: string;
    isLast?: boolean;
}

// Static route labels mapping
const STATIC_LABELS: Record<string, string> = {
    projects: 'Projects',
    services: 'Services',
    networks: 'Networks',
    containers: 'Containers',
    deployments: 'Deployments',
    servers: 'Servers',
    databases: 'Databases',
    logs: 'Logs',
    certificates: 'Certificates',
    notifications: 'Notifications',
    settings: 'Settings',
};

/**
 * Check if a breadcrumb should be skipped
 */
function shouldSkipBreadcrumb(segment: string, index: number, segments: string[], params: Record<string, string | undefined>): boolean {
    // Skip "services" when it's directly after a project ID
    if (segment === 'services') {
        const previousSegment = segments[index - 1];
        return Boolean(params.projectId && previousSegment === params.projectId);
    }
    return false;
}

/**
 * Get the label for a segment
 */
function getSegmentLabel(segment: string, metadata: Record<string, string>, params: Record<string, string | undefined>): string {
    // Static routes
    if (STATIC_LABELS[segment]) {
        return STATIC_LABELS[segment];
    }

    // Dynamic segments with metadata
    if (metadata[segment]) {
        return metadata[segment];
    }

    // Fallback labels for known params
    if (params.projectId && segment === params.projectId) {
        return `Project ${segment}`;
    }
    if (params.serviceId && segment === params.serviceId) {
        return `Service ${segment}`;
    }

    // Default: capitalize first letter
    return segment.charAt(0).toUpperCase() + segment.slice(1);
}

/**
 * Get the correct link path for a segment
 */
function getSegmentPath(segment: string, currentPath: string, index: number, segments: string[], params: Record<string, string | undefined>): string {
    // For project IDs, check if we should link to services page
    const isProjectId = params.projectId && segment === params.projectId;
    if (isProjectId) {
        const hasServicesAfter = segments.slice(index + 1).includes('services');
        const servicesIsLast = segments[segments.length - 1] === 'services';

        // If services comes after but isn't the last segment, link to services
        if (hasServicesAfter && !servicesIsLast) {
            return `${currentPath}/services`;
        }
    }

    return currentPath;
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

        // Add Dashboard as first breadcrumb (except when on home)
        if (location.pathname !== '/') {
            breadcrumbs.push({
                label: 'Dashboard',
                path: '/',
                isLast: false,
            });
        }

        // Process each segment
        let currentPath = '';
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;

            // Skip breadcrumbs that should be hidden
            if (shouldSkipBreadcrumb(segment, index, segments, params)) {
                return;
            }

            const label = getSegmentLabel(segment, metadata, params);
            const linkPath = getSegmentPath(segment, currentPath, index, segments, params);

            breadcrumbs.push({
                label,
                path: linkPath,
                isLast: false, // Will be corrected below
            });
        });

        // Handle home page case
        if (breadcrumbs.length === 0) {
            breadcrumbs.push({
                label: 'Dashboard',
                path: '/',
                isLast: true,
            });
        }

        // Mark the last breadcrumb as last
        if (breadcrumbs.length > 0) {
            breadcrumbs[breadcrumbs.length - 1].isLast = true;
        }

        return breadcrumbs;
    }, [location.pathname, params, metadata]);
}
