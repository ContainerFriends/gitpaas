import { ReactNode } from 'react';

import { Service } from '../../domain/models/service.models';
import { ServiceCard } from './ServiceCard';

interface ServicesListProps {
    services: Service[];
    onEdit?: (service: Service) => void;
    onDelete?: (serviceId: string) => void;
    onViewRepository?: (repositoryUrl: string) => void;
}

/**
 * Services List component
 */
export function ServicesList({ services, onEdit, onDelete, onViewRepository }: ServicesListProps): ReactNode {
    if (services.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No services found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewRepository={onViewRepository}
                />
            ))}
        </div>
    );
}