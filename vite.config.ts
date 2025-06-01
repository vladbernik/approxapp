import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/approxapp/',
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    alias: [
      { find: '@/modules', replacement: path.resolve(__dirname, './src/modules') },
      { find: '@/pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: '@/types', replacement: path.resolve(__dirname, './src/types') },
      { find: '@/components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@/hooks', replacement: path.resolve(__dirname, './src/hooks') },
      { find: '@/contexts', replacement: path.resolve(__dirname, './src/contexts') },
      { find: '@/utils', replacement: path.resolve(__dirname, './src/utils') },
    ],
  },
});
