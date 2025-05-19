import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/approxapp/',
    resolve: {
        alias: [
            { find: '@/modules', replacement: path.resolve(__dirname, './src/modules') },
            { find: '@/pages', replacement: path.resolve(__dirname, './src/pages') },
            { find: '@/layouts', replacement: path.resolve(__dirname, './src/layouts') },
            { find: '@/components', replacement: path.resolve(__dirname, './src/components') },
            { find: '@/entities', replacement: path.resolve(__dirname, './src/entities') },
            { find: '@/locales', replacement: path.resolve(__dirname, './locales') },
        ],
    },
})
