import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/devops-management-ui/' : '/',
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: 'devops-management-ui',
  },
}));
