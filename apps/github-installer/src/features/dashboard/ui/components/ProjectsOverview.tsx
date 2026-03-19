const projects = [
    { name: 'frontend-app', type: 'Next.js', status: 'running' as const },
    { name: 'api-gateway', type: 'Node.js', status: 'deploying' as const },
    { name: 'landing-page', type: 'Static', status: 'running' as const },
    { name: 'worker-service', type: 'Docker', status: 'error' as const },
    { name: 'docs-site', type: 'Static', status: 'running' as const },
];

const statusClasses: Record<string, string> = {
    running: 'status-dot-running',
    deploying: 'status-dot-deploying',
    error: 'status-dot-error',
    stopped: 'status-dot-stopped',
};

export function ProjectsOverview() {
    return (
        <div className="rounded-lg border border-border bg-card">
            <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-medium">Projects</h2>
            </div>
            <div className="divide-y divide-border">
                {projects.map((p) => (
                    <div key={p.name} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2.5">
                            <div className={statusClasses[p.status]} />
                            <div>
                                <span className="text-sm font-medium">{p.name}</span>
                                <p className="text-[11px] text-muted-foreground">{p.type}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
