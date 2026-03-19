import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
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
            '@layout': path.resolve(__dirname, './src/layout'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@shared': path.resolve(__dirname, './src/shared'),
        },
    },
}));
