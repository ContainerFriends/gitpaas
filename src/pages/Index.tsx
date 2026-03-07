import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentDeployments } from "@/components/dashboard/RecentDeployments";
import { ProjectsOverview } from "@/components/dashboard/ProjectsOverview";
import { ServerStatus } from "@/components/dashboard/ServerStatus";

const Dashboard = () => {
  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
};

export default Dashboard;
