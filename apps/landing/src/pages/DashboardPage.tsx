import { ProjectsOverview } from '@features/dashboard/ui/components/ProjectsOverview';
import { RecentDeployments } from '@features/dashboard/ui/components/RecentDeployments';
import { ServerStatus } from '@features/dashboard/ui/components/ServerStatus';
import { StatsCards } from '@features/dashboard/ui/components/StatsCards';
import { AppLayout } from '@layout/containers/AppLayout';

export const DashboardPage = () => {
    return (
        <AppLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Overview of your deployments and infrastructure</p>
                </div>
                <StatsCards />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RecentDeployments />
                    </div>
                    <div className="space-y-6">
                        <ServerStatus />
                        <ProjectsOverview />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
