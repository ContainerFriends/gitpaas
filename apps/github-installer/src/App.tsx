import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { SuccessInstallContainer } from '@features/install/ui/containers/SucessInstallContainer';
import { InstallPage } from '@pages/InstallPage';
import { NotFoundPage } from '@pages/NotFoundPage';

export function App(): ReactNode {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<InstallPage />} />
                    <Route path="/installation-success" element={<SuccessInstallContainer />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
