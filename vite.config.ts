import * as path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        const modules = id.split('node_modules/')[1].split('/')[0]
                        if (['react', 'react-dom', 'lodash', 'moment'].includes(modules)) {
                            return modules
                        }
                    }
                },
            },
        },
    },
    resolve: {
        alias: {
            '@/modules': path.resolve(__dirname, './src/modules'),
            '@/layouts': path.resolve(__dirname, './src/layouts'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/entities': path.resolve(__dirname, './src/entities'),
            '@/locales': path.resolve(__dirname, './locales'),
            '@': path.resolve(__dirname, './src'),
        },
    },
})
