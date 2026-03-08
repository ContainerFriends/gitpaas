import { Plus, Search, GitBranch, Globe, MoreVertical } from 'lucide-react';

import { DashboardLayout } from '@features/dashboard/ui/containers/DashboardLayout';

type ProjectStatus = 'running' | 'stopped' | 'deploying' | 'error';

interface Project {
    id: string;
    name: string;
    type: string;
    status: ProjectStatus;
    domain: string;
    branch: string;
    lastDeploy: string;
    deployCount: number;
}

const projects: Project[] = [
    {
        id: '1',
        name: 'frontend-app',
        type: 'Next.js',
        status: 'running',
        domain: 'app.example.com',
        branch: 'main',
        lastDeploy: '2 min ago',
        deployCount: 48,
    },
    {
        id: '2',
        name: 'api-gateway',
        type: 'Node.js',
        status: 'deploying',
        domain: 'api.example.com',
        branch: 'develop',
        lastDeploy: '5 min ago',
        deployCount: 124,
    },
    {
        id: '3',
        name: 'landing-page',
        type: 'Static',
        status: 'running',
        domain: 'example.com',
        branch: 'main',
        lastDeploy: '12 min ago',
        deployCount: 31,
    },
    {
        id: '4',
        name: 'worker-service',
        type: 'Docker',
        status: 'error',
        domain: '—',
        branch: 'feat/queue',
        lastDeploy: '28 min ago',
        deployCount: 67,
    },
    {
        id: '5',
        name: 'docs-site',
        type: 'VitePress',
        status: 'running',
        domain: 'docs.example.com',
        branch: 'main',
        lastDeploy: '1h ago',
        deployCount: 19,
    },
    {
        id: '6',
        name: 'admin-panel',
        type: 'React',
        status: 'stopped',
        domain: 'admin.example.com',
        branch: 'main',
        lastDeploy: '3h ago',
        deployCount: 42,
    },
    {
        id: '7',
        name: 'auth-service',
        type: 'Go',
        status: 'running',
        domain: 'auth.example.com',
        branch: 'main',
        lastDeploy: '6h ago',
        deployCount: 88,
    },
    {
        id: '8',
        name: 'cdn-proxy',
        type: 'Nginx',
        status: 'running',
        domain: 'cdn.example.com',
        branch: 'main',
        lastDeploy: '2d ago',
        deployCount: 5,
    },
];

const statusDot: Record<ProjectStatus, string> = {
    running: 'status-dot-running',
    deploying: 'status-dot-deploying',
    error: 'status-dot-error',
    stopped: 'status-dot-stopped',
};

const statusLabel: Record<ProjectStatus, string> = {
    running: 'Running',
    deploying: 'Deploying',
    error: 'Error',
    stopped: 'Stopped',
};

const statusText: Record<ProjectStatus, string> = {
    running: 'text-success',
    deploying: 'text-warning',
    error: 'text-destructive',
    stopped: 'text-muted-foreground',
};

const Projects = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{projects.length} projects deployed</p>
                    </div>
                    <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                        New Project
                    </button>
                </div>

                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filter projects..."
                        className="h-8 w-full rounded-md border border-border bg-muted/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className={statusDot[project.status]} />
                                    <div>
                                        <h3 className="text-sm font-semibold">{project.name}</h3>
                                        <span className="text-[11px] text-muted-foreground">{project.type}</span>
                                    </div>
                                </div>
                                <button className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreVertical className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Globe className="h-3 w-3" />
                                    <span className="font-mono truncate">{project.domain}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <GitBranch className="h-3 w-3" />
                                    <span className="font-mono">{project.branch}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                                <span className={`text-[11px] font-medium ${statusText[project.status]}`}>{statusLabel[project.status]}</span>
                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                    <span>{project.deployCount} deploys</span>
                                    <span>{project.lastDeploy}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Projects;
