# ProactiveDB Monitoring Agent

This Python script is a cross-platform monitoring agent responsible for collecting health and performance metrics from an Oracle database and its underlying operating system (Linux, Windows, Solaris). It sends this data to the ProactiveDB centralized server for visualization.

## Features

-   **Cross-Platform**: Works on Linux, Windows, and Solaris.
-   **Comprehensive Metrics**: Collects a wide range of data:
    -   **OS**: CPU, memory, disk, network, uptime.
    -   **Oracle DB**: Status, version, edition, uptime, active sessions, tablespace usage, RMAN backups, and recent alert log errors.
-   **Local Time-Series Storage**: The agent stores OS and active session metrics locally in a SQLite database (`agent_data.sqlite`). This allows it to send historical data (e.g., last 2 days) to the dashboard for charting.
-   **Resilient Offline Caching**: If the central server is unreachable, the agent automatically caches its data payloads in a local SQLite queue (`agent_cache.sqlite`). It will send the cached data in order once the connection is re-established, ensuring no monitoring data is lost.
-   **Configurable**: All settings, including server endpoint, data collection frequency, and database credentials, are managed in an external `config.ini` file.
-   **Efficient**: Designed for low resource overhead and includes proper handling of database connections and local file storage.

## Prerequisites

-   Python 3.7+
-   Oracle Instant Client (required by the `oracledb` library)

## Setup

1.  **Clone the repository** and navigate into the `agent` directory.

2.  **Install Python dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Install Oracle Instant Client**:
    Download the appropriate Instant Client for your OS from the Oracle website and follow their installation instructions. Ensure it's in your system's PATH or library path.

4.  **Configure the Agent**:
    -   Copy the example configuration file:
        ```bash
        cp config.ini.example config.ini
        ```
    -   Edit `config.ini` with your specific details:
        -   `[server] url`: The URL of your centralized ProactiveDB server.
        -   `[agent] db_id`: A unique ID for the database being monitored (e.g., `db1-linux`). This MUST match an ID used by the frontend.
        -   `[agent] customer_id`: The ID for the customer this database belongs to.
        -   `[agent] collection_interval_seconds`: How often to collect and send data.
        -   `[agent] history_retention_days`: How many days of time-series data to keep locally.
        -   `[database] user`, `password`, `dsn`: Your Oracle database credentials and connection string.

## Running the Agent

You can run the agent directly from the command line. For continuous monitoring, it is highly recommended to run it as a background process or a system service (e.g., using `systemd` on Linux or as a Windows Service).

```bash
python agent.py
```

The agent will start collecting data immediately and send it to the configured server URL at the specified frequency. All activities and potential errors are logged to the console.
