import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
    base: process.env.VITE_BASE_URL || '/',
    server: {
        port: 3000,
        hmr: {
            overlay: false,
        },
    },
    plugins: [react()].filter(Boolean),
    resolve: {
        alias: {
            '@core': path.resolve(__dirname, './src/core'),
            '@features': path.resolve(__dirname, './src/features'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@shared': path.resolve(__dirname, './src/shared'),
        },
    },
}));
