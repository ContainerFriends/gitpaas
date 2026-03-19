import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { InstallPage } from '@pages/InstallPage';
import { NotFoundPage } from '@pages/NotFoundPage';

export function App(): ReactNode {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<InstallPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
