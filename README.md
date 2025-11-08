# ProactiveDB: Oracle Monitoring Dashboard

A centralized dashboard to monitor Oracle databases (11g to 19c) and their underlying OS (Linux, Windows, Solaris). It provides real-time insights into performance, availability, and resource utilization with a modern, glossy, dark-themed UI.

## Architecture

The system uses a 2-tier architecture consisting of:
1.  **Monitoring Agent**: A Python script that collects and sends data. (`/agent`)
2.  **Centralized Server**: A Node.js application that receives data, stores it, and serves the frontend dashboard. (`/server`)

For more details, see `ARCHITECTURE.md`.

---

## Centralized Port Configuration

All port settings are managed in a single file: `project.config.json` in the root directory. If you need to change the ports for the frontend development server or the backend API, you only need to edit this one file.

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

For development, you need to run both the backend API server and the frontend Vite server concurrently. **This requires two separate terminals.**

**Terminal 1: Start the Backend API Server**
```bash
cd server
npm run dev
```
> This starts the Node.js API server on the port defined as `backend_port` in `project.config.json`. It will automatically restart when you make changes to server files.

**Terminal 2: Start the Frontend Development Server**
```bash
# In the project root directory
npm run dev
```
> This starts the Vite development server on the port defined as `frontend_port` in `project.config.json`.

**How it works:** Open your browser to the frontend URL (e.g., `http://localhost:3000`). The Vite server serves the React application. We have configured a proxy in `vite.config.ts` that automatically forwards any API requests to the backend server using the ports defined in `project.config.json`. This provides a seamless development experience from a single port in the browser.

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