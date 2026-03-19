import { motion } from 'framer-motion';
import { ExternalLink, Github, CheckCircle2, Shield, Rocket } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@shared/components/button';

const steps = [
    {
        icon: Github,
        title: 'Install the GitHub App',
        description:
            'Click the button below to install the GitPaaS GitHub App on your GitHub account or organization. You can grant access to all repositories or select specific ones.',
    },
    {
        icon: Shield,
        title: 'Authorize permissions',
        description:
            'GitPaaS only requests minimal permissions: read-only access to repository contents, commit statuses, and webhook events. Review and approve them on GitHub.',
    },
    {
        icon: Rocket,
        title: 'Start deploying',
        description:
            'Once the app is installed, add a gitpaas.yaml to any authorized repository, push your code, and GitPaaS will automatically build and deploy it.',
    },
];

/**
 * Install container component.
 */
export function InstallContainer(): ReactNode {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            {/* Background effects */}
            <div className="fixed inset-0 bg-hero-gradient pointer-events-none" />
            <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-primary/8 rounded-full blur-[128px] pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/3 w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 w-full">
                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-glow bg-secondary/50 mb-6">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-mono text-muted-foreground">GitPaaS is running on your server</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
                        Connect your <span className="text-gradient">GitHub</span>
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                        Your GitPaaS instance is ready. Install the GitHub App to start deploying your repositories automatically.
                    </p>
                </motion.div>

                {/* Install CTA — prominent, first */}
                <motion.div
                    className="rounded-2xl border border-glow bg-card-gradient p-8 md:p-10 text-center mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                        <Github className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Install the GitHub App</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        This will redirect you to GitHub where you can choose which repositories GitPaaS can access.
                    </p>
                    <Button size="lg" className="text-base px-10 py-6 h-auto glow-sm text-lg font-semibold" asChild>
                        <a href="https://github.com/apps/gitpaas/installations/new" target="_blank" rel="noopener noreferrer">
                            <Github className="w-5 h-5 mr-2" />
                            Install GitHub App
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">You'll be redirected to GitHub to authorize the installation.</p>
                </motion.div>

                {/* How it works — simplified */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center mb-8">How it works</h3>
                    <div className="space-y-5">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                className="flex gap-4 items-start"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.35 + i * 0.1 }}
                            >
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center relative">
                                    <step.icon className="w-5 h-5 text-primary" />
                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">{step.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer */}
                <div className="mt-16 text-center text-xs text-muted-foreground">
                    Need help?{' '}
                    <a href="#" className="text-primary hover:underline">
                        Check the documentation
                    </a>{' '}
                    or{' '}
                    <a href="#" className="text-primary hover:underline">
                        open an issue on GitHub
                    </a>
                    .
                </div>
            </div>
        </div>
    );
}
