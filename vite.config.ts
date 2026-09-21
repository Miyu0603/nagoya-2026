
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base 對應 GitHub Pages 的 repo 名稱
  base: '/nagoya-2026/',
  build: {
    outDir: 'dist',
  }
});
