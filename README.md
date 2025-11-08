# ProactiveDB: Oracle Monitoring Dashboard

A centralized dashboard to monitor Oracle databases (11g to 19c) and their underlying OS (Linux, Windows, Solaris). It provides real-time insights into performance, availability, and resource utilization with a modern, glossy, dark-themed UI.

## Architecture

The system uses a 2-tier architecture consisting of:
1.  **Monitoring Agent**: A Python script that collects and sends data. (`/agent`)
2.  **Centralized Server**: A Node.js application that receives data, stores it, and serves the frontend dashboard. (`/server`)

For more details, see `ARCHITECTURE.md`.

---

## Centralized Port Configuration

All port settings are managed in `project.config.json` in the root directory. This file defines separate ports for the frontend development server and the backend API server to prevent conflicts.

---

## Development Setup

### Prerequisites
- Node.js (v16 or newer)
- npm
- Python 3.7+ (for the agent)

### Installation

1.  **Install Frontend Dependencies:**
    In the project root directory (`oracle-db-monitoring-dashboard`), run:
    ```bash
    npm install
    ```

2.  **Install Backend Dependencies:**
    Navigate to the server directory and run:
    ```bash
    cd server
    npm install
    cd ..
    ```

### Running the Application (Development Mode)

The development environment is designed to be started with a **single command** in **one terminal**.

**Start the Development Server:**
In the project root directory, run:
```bash
npm run dev
```

> This single command performs two actions automatically:
> 1.  It starts the **backend API server** (`server/server.js`) in the background.
> 2.  It starts the **Vite frontend development server**.

**How it works:** The Vite server hosts the React app (e.g., on `http://localhost:5173`) with Hot Module Replacement (HMR). A proxy is configured in Vite to automatically forward any API requests (e.g., to `/api/*`) to the backend server, which is running on its own port. This provides a seamless development experience without module conflicts or needing multiple terminals.

**Automatic Restarting:**
- Changes to frontend files (in `/src`) will instantly update in your browser (HMR).
- Changes to the backend server file (`/server/server.js`) will require you to manually restart the Vite dev server (Ctrl+C and `npm run dev` again).

---

## Monitoring Agent

For instructions on how to set up and run the Python monitoring agent, please see the detailed guide in its directory:
-   **[`agent/README.md`](./agent/README.md)**

---

## Production Build

To create a production-ready build of the application:

1.  **Build the React Frontend:**
    ```bash
    npm run build
    ```
    This will create an optimized build of the frontend in the `/build` directory.

2.  **Run the Production Server:**
    ```bash
    cd server
    npm start
    ```
    The Node.js server will now serve both the API and the optimized frontend from a single port (the one defined as `backend_port` in the config). The API endpoint configuration works for both development and production without any changes.