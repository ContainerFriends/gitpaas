import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Index from '@pages/Index';
import NotFound from '@pages/NotFound';
import Projects from '@pages/Projects';
import { TooltipProvider } from '@shared/components/tooltip';

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
