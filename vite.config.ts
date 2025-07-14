import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@/core': resolve(__dirname, 'src/core'),
            '@/components': resolve(__dirname, 'src/components'),
            '@/hooks': resolve(__dirname, 'src/hooks'),
            '@/utils': resolve(__dirname, 'src/utils'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
})
