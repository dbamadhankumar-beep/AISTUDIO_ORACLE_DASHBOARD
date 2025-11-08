# ProactiveDB Centralized Server

This Node.js application (using Express) is the backend for the ProactiveDB monitoring system.

## Responsibilities

1.  **API Server**: Provides a REST API endpoint (`POST /api/agent/data`) for monitoring agents to send their data.
2.  **Web Server**: Serves the React frontend dashboard. In production, it serves the static files from the `build` directory.
3.  **Data Hub**: Persists the latest metrics from all agents into a **SQLite database** (`proactivedb.sqlite`) and provides this data to the frontend via `GET /api/frontend/data`.

## Setup & Running

For complete setup and development instructions, please refer to the main project `README.md` file in the root directory.

This server is designed to be run concurrently with the frontend Vite development server. See the main `README.md` for the two-terminal startup procedure.

## SQLite Persistent Storage

This server uses a local **SQLite database** (`proactivedb.sqlite`) to store the latest data payload received from each monitoring agent. This ensures that monitoring data persists even if the server is restarted.
