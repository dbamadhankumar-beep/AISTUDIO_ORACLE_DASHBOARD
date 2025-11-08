
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as fs from 'fs';
import * as path from 'path';

// Load configuration synchronously to ensure port values are available.
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'project.config.json'), 'utf-8'));


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to integrate the Express server as middleware
    {
      name: 'express-server',
      configureServer: async (server) => {
        // We use require here because server.js is a CommonJS module.
        const { createExpressApp } = require('./server/server.js');
        const app = await createExpressApp();
        
        // Mount the Express app on the '/api' path.
        // All requests to '/api/*' will now be handled by our Express server.
        server.middlewares.use('/api', app);
      },
    },
  ],
  server: {
    port: config.port, // Use the single port from the config
  },
});