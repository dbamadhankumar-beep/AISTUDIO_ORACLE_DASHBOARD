# ProactiveDB Live Data Architecture

The ProactiveDB system uses a three-tier architecture to provide a scalable and maintainable monitoring solution. The components are the **Monitoring Agent**, the **Centralized Server**, and the **Dashboard Frontend**.

This document describes the final, persistent architecture using SQLite for data storage.

## 1. Monitoring Agent (`/agent`)

A powerful, stateful Python script that you install on every server you want to monitor.

-   **Responsibility**:
    1.  Collect comprehensive health and performance metrics from the OS and Oracle DB.
    2.  Store time-series data (for CPU, memory, etc.) locally in its own **SQLite database (`agent_data.sqlite`)**.
    3.  On a schedule, package the latest point-in-time metrics and recent historical data into a single JSON payload.
    4.  Send this payload to the Centralized Server.
-   **Data Transmission**: Securely sends data to the Centralized Server via HTTP POST.
-   **Resilience**: If the server is unavailable, the agent caches payloads in a separate **SQLite database (`agent_cache.sqlite`)** and sends them when the connection is restored, preventing data loss.
-   **Configuration**: The agent's behavior, including collection frequency, history retention, and server address, is managed via `agent/config.ini`.

**See `agent/README.md` for full setup and usage instructions.**

## 2. Centralized Dashboard Server (`/server`)

This is the core of the system. It acts as the brain, receiving data from all agents and serving the user interface to the administrator.

-   **Responsibility**:
    -   Provide a REST API (`POST /api/agent/data`) for agents to submit their JSON data payloads.
    -   **Persist** the latest payload from each agent into a central **SQLite database (`proactivedb.sqlite`)**. This replaces the previous volatile in-memory storage.
    -   Provide a REST API (`GET /api/frontend/data`) for the frontend to fetch the latest state of all systems.
    -   Serve the static files (HTML, JS, CSS) of the React frontend.
-   **Implementation**: A Node.js Express server (`server/server.js`) with the `sqlite` package for database operations.

**See `server/README.md` for setup and usage instructions.**

## 3. Dashboard Frontend (This React App)

The user interface you see and interact with, located in the root of this project.

-   **Responsibility**:
    -   Provide a rich, interactive visualization of the monitoring data.
    -   Fetch the complete state for all databases from the centralized server's API.
    -   Display live data by periodically polling the server for the latest metrics.
-   **Data Flow**:
    1.  The app fetches the initial state from `GET /api/frontend/data`. The server reads its SQLite DB to assemble this state.
    2.  A timer periodically re-fetches from the same endpoint.
    3.  The UI components, optimized with `React.memo`, update efficiently to reflect the new data.
-   **API Integration**: The frontend communicates with the backend via the `services/apiService.ts` module. In a real deployment, you would update this file to point to the production server's URL.
