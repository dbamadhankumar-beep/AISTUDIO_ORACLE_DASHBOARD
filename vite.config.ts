import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import config from './project.config.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: config.frontend_port, // Port for the frontend dev server
    proxy: {
      // Proxy API requests from the frontend to the backend server.
      // This allows the frontend and backend to feel like they are
      // running on the same port during development.
      '/api': {
        target: `http://localhost:${config.backend_port}`, // Read backend port from config
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Recommended for http targets
      },
    },
  },
});
