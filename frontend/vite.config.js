import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/pdf': isProd ? 'https://easy-download.onrender.com' : 'http://localhost:10000',
      '/pdfs-zip': isProd ? 'https://easy-download.onrender.com' : 'http://localhost:10000',
    },
  },
});