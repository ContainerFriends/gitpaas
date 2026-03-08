import { GitBranch, Clock, ExternalLink } from 'lucide-react';

type DeploymentStatus = 'success' | 'deploying' | 'failed' | 'queued';

interface Deployment {
    id: string;
    project: string;
    branch: string;
    commit: string;
    status: DeploymentStatus;
    time: string;
    duration: string;
}

const deployments: Deployment[] = [
    {
        id: '1',
        project: 'frontend-app',
        branch: 'main',
        commit: 'fix: auth redirect',
        status: 'success',
        time: '2 min ago',
        duration: '1m 23s',
    },
    {
        id: '2',
        project: 'api-gateway',
        branch: 'develop',
        commit: 'feat: rate limiting',
        status: 'deploying',
        time: '5 min ago',
        duration: '—',
    },
    {
        id: '3',
        project: 'landing-page',
        branch: 'main',
        commit: 'update hero section',
        status: 'success',
        time: '12 min ago',
        duration: '45s',
    },
    {
        id: '4',
        project: 'worker-service',
        branch: 'feat/queue',
        commit: 'add retry logic',
        status: 'failed',
        time: '28 min ago',
        duration: '2m 01s',
    },
    {
        id: '5',
        project: 'docs-site',
        branch: 'main',
        commit: 'update api reference',
        status: 'success',
        time: '1h ago',
        duration: '32s',
    },
    {
        id: '6',
        project: 'admin-panel',
        branch: 'main',
        commit: 'fix: table pagination',
        status: 'queued',
        time: 'just now',
        duration: '—',
    },
];

const statusStyles: Record<DeploymentStatus, string> = {
    success: 'text-success',
    deploying: 'text-warning',
    failed: 'text-destructive',
    queued: 'text-muted-foreground',
};

const statusDot: Record<DeploymentStatus, string> = {
    success: 'status-dot-running',
    deploying: 'status-dot-deploying',
    failed: 'status-dot-error',
    queued: 'status-dot-stopped',
};

const statusLabel: Record<DeploymentStatus, string> = {
    success: 'Success',
    deploying: 'Deploying',
    failed: 'Failed',
    queued: 'Queued',
};

export function RecentDeployments() {
    return (
        <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-sm font-medium">Recent Deployments</h2>
                <button className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                    View all <ExternalLink className="h-3 w-3" />
                </button>
            </div>
            <div className="divide-y divide-border">
                {deployments.map((d) => (
                    <div key={d.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer group">
                        <div className={statusDot[d.status]} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium truncate">{d.project}</span>
                                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                                    <GitBranch className="h-3 w-3" />
                                    {d.branch}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5 font-mono">{d.commit}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <span className={`text-xs font-medium ${statusStyles[d.status]}`}>{statusLabel[d.status]}</span>
                            <div className="flex items-center gap-2 mt-0.5 justify-end">
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {d.duration}
                                </span>
                                <span className="text-[11px] text-muted-foreground">{d.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
