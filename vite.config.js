import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            laravel({
                input: ['resources/js/app.jsx'],
                refresh: true,
            }),
            react(),
        ],
        server: {
            host: '0.0.0.0',
            port: 5173,
            strictPort: true,
            https: false,
            hmr: {
                host: 'localhost',
                protocol: 'ws',
                port: 5173,
            },
            allowedHosts: [
                env.APP_ALLOW_URL,
                'localhost',
                '127.0.0.1'
            ].filter(Boolean),
            watch: {
                usePolling: true,
            },
        },
    };
});
