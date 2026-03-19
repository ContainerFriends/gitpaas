import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { ReactNode } from 'react';

/**
 * Install error container component.
 */
export function InstallErrorContainer(): ReactNode {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Background effects */}
            <div className="fixed inset-0 bg-hero-gradient pointer-events-none" />
            <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-destructive/8 rounded-full blur-[128px] pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/3 w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Main content */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4">
                <div className="max-w-2xl w-full">
                    <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 mb-6">
                            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                            <span className="text-xs font-mono text-destructive">Installation failed</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
                            Something went <span className="text-destructive">wrong</span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                            Something went wrong during the GitHub App installation. <br /> Please try again.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 py-6 text-center text-xs text-muted-foreground">
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
    );
}
