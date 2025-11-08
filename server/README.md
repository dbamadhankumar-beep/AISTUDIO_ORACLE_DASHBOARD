# ProactiveDB Centralized Server

This Node.js application, built with Express, serves as the central hub for the ProactiveDB monitoring system.

## Responsibilities

1.  **API Server**: It provides a REST API endpoint for the distributed Python monitoring agents to send their collected data.
2.  **Web Server**: It serves the compiled static files (HTML, CSS, JS) of the React-based frontend dashboard.
3.  **Data Hub**: It persists the latest metrics from all agents into a **SQLite database**, serving this data to the frontend when it requests updates.

This combined role creates a "single" unified application, as the same server process manages both the backend API and the frontend UI.

## SQLite Persistent Storage

This server uses a local **SQLite database** (`proactivedb.sqlite`) to store the latest data payload received from each monitoring agent. This provides key advantages over the previous in-memory approach:

-   **Persistence**: Monitoring data is not lost when the server restarts.
-   **Lower Memory Usage**: The Node.js process does not need to hold all monitoring data in memory, making it more scalable and efficient.
-   **Simplicity**: SQLite provides a file-based, serverless database engine that is easy to set up and manage.

For a larger-scale production environment with extensive historical data requirements, you might consider migrating to a dedicated time-series database like TimescaleDB or InfluxDB.

## Setup & Running

### Prerequisites

-   Node.js (v16 or newer)
-   npm

### Installation

1.  Navigate to the `server` directory.
2.  Install the required npm packages:
    ```bash
    npm install
    ```
    This will install Express, CORS, and the necessary SQLite libraries.

### Running the Server

-   **For development (with auto-restarting on file changes):**
    ```bash
    npm run dev
    ```
-   **For production:**
    ```bash
    npm start
    ```

Once started, the server will create a `proactivedb.sqlite` file in the `server` directory and begin listening on `http://localhost:4000` by default.

## API Endpoints

-   `POST /api/agent/data`
    -   **Usage**: The Python agents send their data to this endpoint.
    -   **Body**: A JSON payload containing all the collected metrics for a specific database. The server will save this payload to the SQLite database.

-   `GET /api/frontend/data`
    -   **Usage**: The React frontend calls this endpoint to get the latest state of all monitored databases.
    -   **Response**: A JSON array of customers, with their databases nested inside, formatted for the dashboard.
