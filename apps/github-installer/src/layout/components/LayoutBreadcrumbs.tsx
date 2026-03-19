import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { useBreadcrumbs } from '../hooks/useBreadcrumbs';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@shared/components/Breadcrumb';

/**
 * Breadcrumbs layout component
 */
export function LayoutBreadcrumbs(): ReactNode {
    const breadcrumbs = useBreadcrumbs();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <BreadcrumbItem key={breadcrumb.path}>
                        {breadcrumb.isLast ? (
                            <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        ) : (
                            <>
                                <BreadcrumbLink asChild>
                                    <Link to={breadcrumb.path} className="hover:text-foreground transition-colors">
                                        {breadcrumb.label}
                                    </Link>
                                </BreadcrumbLink>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
