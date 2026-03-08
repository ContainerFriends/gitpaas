import { Button } from '@shared/components/button';
import { Input } from '@shared/components/input';
import { Plus, Search } from 'lucide-react';
import { ReactNode } from 'react';

interface ServicesHeaderProps {
    filter: string;
    onFilterChange: (filter: string) => void;
    onCreateService: () => void;
    servicesCount: number;
    projectName?: string;
}

/**
 * Services Header component
 */
export function ServicesHeader({ 
    filter, 
    onFilterChange, 
    onCreateService, 
    servicesCount,
    projectName 
}: ServicesHeaderProps): ReactNode {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {projectName ? `${projectName} Services` : 'Services'}
                    </h1>
                    <p className="text-gray-600">
                        Manage deployment services for this project ({servicesCount} service{servicesCount !== 1 ? 's' : ''})
                    </p>
                </div>
                <Button onClick={onCreateService} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Service
                </Button>
            </div>
            
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search services..."
                        value={filter}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>
        </div>
    );
}