
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Load configuration synchronously to ensure port values are available.
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'project.config.json'), 'utf-8'));


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to spawn the Express server as a separate process
    {
      name: 'run-backend-server',
      configureServer(server) {
        // Spawn the node server.js process
        const backend = spawn('node', ['server/server.js'], {
          stdio: 'inherit', // Pipe backend's console output to the main terminal
          shell: true,      // Use shell for better compatibility, especially on Windows
        });

        // Kill the backend process when the Vite server is closed
        server.httpServer.on('close', () => {
          console.log('Vite server closing, terminating backend process...');
          backend.kill();
        });
      },
    },
  ],
  server: {
    port: config.frontend_port,
    proxy: {
      // Proxy all requests starting with /api to the backend server
      '/api': {
        target: `http://localhost:${config.backend_port}`,
        changeOrigin: true, // Recommended for virtual-hosted sites
        secure: false,      // For self-signed certs
      },
    },
  },
});