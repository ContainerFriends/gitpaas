import { Bell, Search } from 'lucide-react';
import { ReactNode } from 'react';

import { LayoutSidebar } from '../components/LayoutSidebar';

import { SidebarProvider, SidebarTrigger } from '@shared/components/sidebar';

/**
 * Application layout component.
 */
export function AppLayout({ children }: { children: ReactNode }): ReactNode {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <LayoutSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    className="h-8 w-64 rounded-md border border-border bg-muted/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="relative h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <Bell className="h-4 w-4" />
                                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                            </button>
                        </div>
                    </header>
                    <main className="flex-1 p-6 overflow-auto">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    );
}
