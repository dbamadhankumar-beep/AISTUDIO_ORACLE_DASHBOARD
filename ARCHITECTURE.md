# ProactiveDB 2-Tier Architecture

The ProactiveDB system uses a simplified and robust two-tier architecture, making it easy to deploy and manage. The components are the **Monitoring Agent** and the **Centralized Server**, which also serves the frontend dashboard.

## Tier 1: Monitoring Agent (`/agent`)

A powerful, stateful Python script that you install on every server you want to monitor.

-   **Responsibility**:
    1.  Collect comprehensive health and performance metrics from the OS and Oracle DB.
    2.  Store time-series data locally in its own **SQLite database (`agent_data.sqlite`)**.
    3.  Package the latest point-in-time metrics and historical data into a single JSON payload.
    4.  Send this payload to the Centralized Server's API endpoint (`POST /api/agent/data`).
-   **Resilience**: Features an offline caching mechanism using a local SQLite database (`agent_cache.sqlite`) to prevent data loss during network outages.
-   **Configuration**: All settings are managed via `agent/config.ini`.

**See `agent/README.md` for full setup and usage instructions.**

## Tier 2: Centralized Server & Dashboard (`/server` & React Frontend)

This is the core of the system. It's a single Node.js application that acts as both the backend API and the web server for the user interface.

-   **Backend Responsibilities**:
    -   Provide a REST API (`POST /api/agent/data`) to receive data from all agents.
    -   Persist the latest data from each agent into a central **SQLite database (`proactivedb.sqlite`)**.
    -   Provide a REST API (`GET /api/frontend/data`) for the dashboard to fetch the latest state of all monitored systems.

-   **Frontend Responsibilities**:
    -   Serve the static files (HTML, JS, CSS) of the compiled React dashboard.
    -   The dashboard, running in the user's browser, provides a rich, interactive visualization of the monitoring data.
    -   It fetches its initial data from the server and then periodically polls the `GET /api/frontend/data` endpoint to display live updates.

-   **Implementation**: A Node.js Express server (`server/server.js`) that serves the React application and provides the API. The frontend communicates with this backend via the `services/apiService.ts` module.

**See `server/README.md` for setup and usage instructions.**
