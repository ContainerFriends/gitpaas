import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { DashboardPage } from '@pages/DashboardPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { ProjectsPage } from '@pages/ProjectsPage';
import { Toaster } from '@shared/components/sonner';
import { TooltipProvider } from '@shared/components/tooltip';

const queryClient = new QueryClient();

/**
 * Main application component
 */
export function App(): ReactNode {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <TooltipProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </BrowserRouter>
                    <Toaster />
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
