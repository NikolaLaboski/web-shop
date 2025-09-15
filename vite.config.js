import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/graphql': {
        target: 'https://fullstack-test-starter-production-34d9.up.railway.app/graphql',
        changeOrigin: true,
        secure: true
      }
    }
  }
});
