import { Cpu, HardDrive, MemoryStick } from 'lucide-react';

const servers = [
    {
        name: 'prod-01',
        status: 'running' as const,
        cpu: 34,
        ram: 62,
        disk: 45,
    },
    {
        name: 'prod-02',
        status: 'running' as const,
        cpu: 12,
        ram: 38,
        disk: 22,
    },
    {
        name: 'staging',
        status: 'running' as const,
        cpu: 8,
        ram: 24,
        disk: 15,
    },
    {
        name: 'dev-01',
        status: 'stopped' as const,
        cpu: 0,
        ram: 0,
        disk: 67,
    },
];

function MetricBar({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
    const barColor = value > 80 ? 'bg-destructive' : value > 60 ? 'bg-warning' : 'bg-primary';
    return (
        <div>
            <div className="flex items-center gap-1 mb-1">
                <Icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${value}%` }} />
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 block">{value}%</span>
        </div>
    );
}

export function ServerStatus() {
    return (
        <div className="rounded-lg border border-border bg-card">
            <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-medium">Servers</h2>
            </div>
            <div className="divide-y divide-border">
                {servers.map((server) => (
                    <div key={server.name} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={server.status === 'running' ? 'status-dot-running' : 'status-dot-stopped'} />
                            <span className="text-sm font-mono font-medium">{server.name}</span>
                        </div>
                        {server.status === 'running' && (
                            <div className="grid grid-cols-3 gap-3">
                                <MetricBar icon={Cpu} label="CPU" value={server.cpu} />
                                <MetricBar icon={MemoryStick} label="RAM" value={server.ram} />
                                <MetricBar icon={HardDrive} label="Disk" value={server.disk} />
                            </div>
                        )}
                        {server.status === 'stopped' && <p className="text-xs text-muted-foreground">Stopped</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
