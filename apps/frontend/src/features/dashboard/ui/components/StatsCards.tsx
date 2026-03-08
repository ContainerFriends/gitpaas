import { Layers, Globe, Server, Activity } from 'lucide-react';

const stats = [
    {
        label: 'Projects',
        value: '12',
        icon: Layers,
        change: '+2 this week',
    },
    {
        label: 'Deployments',
        value: '148',
        icon: Globe,
        change: '23 today',
    },
    {
        label: 'Servers',
        value: '4',
        icon: Server,
        change: 'All healthy',
    },
    {
        label: 'Uptime',
        value: '99.9%',
        icon: Activity,
        change: 'Last 30 days',
    },
];

export function StatsCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
            ))}
        </div>
    );
}
