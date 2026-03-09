import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { DashboardPage } from '@pages/DashboardPage';
import { NetworksPage } from '@pages/NetworksPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { ProjectsPage } from '@pages/ProjectsPage';
import { ServiceDetailPage } from '@pages/ServiceDetailPage';
import { ServicesPage } from '@pages/ServicesPage';
import { Toaster } from '@shared/components/sonner';
import { TooltipProvider } from '@shared/components/tooltip';

const queryClient = new QueryClient();

export function App(): ReactNode {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <TooltipProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/projects/:projectId/services" element={<ServicesPage />} />
                            <Route path="/projects/:projectId/services/:serviceId" element={<ServiceDetailPage />} />
                            <Route path="/networks" element={<NetworksPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </BrowserRouter>
                    <Toaster />
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
