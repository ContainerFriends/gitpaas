import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

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

    return useMemo(() => {
        const breadcrumbs: BreadcrumbItem[] = [];
        const segments = location.pathname.split('/').filter(Boolean);

        // Always start with Dashboard (home)
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
                    label = 'Proyectos';
                    break;
                case 'services':
                    label = 'Servicios';
                    break;
                case 'networks':
                    label = 'Redes';
                    break;
                case 'deployments':
                    label = 'Despliegues';
                    break;
                case 'servers':
                    label = 'Servidores';
                    break;
                case 'databases':
                    label = 'Base de Datos';
                    break;
                case 'logs':
                    label = 'Registros';
                    break;
                case 'certificates':
                    label = 'Certificados';
                    break;
                case 'notifications':
                    label = 'Notificaciones';
                    break;
                case 'settings':
                    label = 'Configuración';
                    break;
                default:
                    // Handle dynamic segments (IDs)
                    if (params.projectId && segment === params.projectId) {
                        label = `Proyecto ${segment}`;
                    } else if (params.serviceId && segment === params.serviceId) {
                        label = `Servicio ${segment}`;
                    } else {
                        // Capitalize first letter for other segments
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
    }, [location.pathname, params]);
}
