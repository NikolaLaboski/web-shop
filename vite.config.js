import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/graphql': {
        target: 'https://scandi-shop-backend-production.up.railway.app',
        changeOrigin: true,
        secure: true
      }
    }
  }
});
