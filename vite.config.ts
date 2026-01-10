import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
  server: {
    proxy: {
      '/api/n8n-publish': {
        target: 'https://foundrly.app.n8n.cloud/webhook-test/linkedin-post',
        changeOrigin: true,
        rewrite: (path) => '',
        secure: false,
      },
      '/openai-proxy': {
        target: 'https://api.openai.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openai-proxy/, ''),
        secure: false, // Handle SSL potentially
        headers: {
          'Origin': 'https://api.openai.com' // Spoof origin
        }
      }
    },
  },
  publicDir: 'public',
});
