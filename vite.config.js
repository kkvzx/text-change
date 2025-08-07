
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                background: resolve(__dirname, 'src/background.ts'),
                offscreen: resolve(__dirname, 'src/offscreen.ts')
            },
            output:{
                entryFileNames: '[name].js',
                format: 'es',
                manualChunks: undefined
            }
        },
        minify: true,
        target: 'chrome88',
        sourcemap: process.env.NODE_ENV === 'development'
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    }
});