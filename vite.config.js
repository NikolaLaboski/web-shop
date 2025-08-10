import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
  '/graphql': {
    target: 'http://localhost',   // <-- без :8000
    changeOrigin: true,
    rewrite: () => '/backend/graphql/index.php',
    secure: false,
  },
},

  },
});
