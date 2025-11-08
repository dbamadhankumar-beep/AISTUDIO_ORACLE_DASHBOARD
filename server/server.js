// ProactiveDB Centralized Server (Express.js)

const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const config = require('../project.config.json');

const DB_FILE = path.join(__dirname, 'proactivedb.sqlite');
let db;

// --- Database Functions ---
async function initializeDatabase() {
  try {
    const db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });
    console.log('Connected to the SQLite database.');
    await db.exec(`
      CREATE TABLE IF NOT EXISTS agent_data (
        dbId TEXT PRIMARY KEY,
        customerId TEXT NOT NULL,
        data TEXT NOT NULL,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database schema checked/created.');
    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}


async function createExpressApp() {
  // Initialize DB if it hasn't been already
  if (!db) {
    db = await initializeDatabase();
  }
  
  const app = express();
  
  // --- Middleware ---
  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // Increased limit for detailed agent payloads

  // --- API Endpoints ---

  /**
   * @route   POST /api/agent/data
   * @desc    Endpoint for agents to send data. It now uses an UPSERT operation.
   */
  app.post('/agent/data', async (req, res) => {
    const data = req.body;
    if (!data.dbId || !data.customerId) {
      return res.status(400).json({ message: 'dbId and customerId are required.' });
    }

    console.log(`[${new Date().toISOString()}] Received data from agent for DB: ${data.dbId}`);
    
    try {
      const stmt = `
        INSERT INTO agent_data (dbId, customerId, data, last_updated)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(dbId) DO UPDATE SET
          customerId = excluded.customerId,
          data = excluded.data,
          last_updated = CURRENT_TIMESTAMP;
      `;
      await db.run(stmt, data.dbId, data.customerId, JSON.stringify(data));
      res.status(200).json({ message: 'Data received successfully.' });
    } catch (error) {
      console.error('Failed to write agent data to DB:', error);
      res.status(500).json({ message: 'Internal server error while saving data.' });
    }
  });

  /**
   * @route   GET /api/frontend/data
   * @desc    Endpoint for the frontend to fetch the latest data for all databases from SQLite.
   */
  app.get('/frontend/data', async (req, res) => {
      console.log(`[${new Date().toISOString()}] Frontend requested data update.`);
      try {
          const rows = await db.all("SELECT data FROM agent_data");
          const allAgentData = rows.map(row => JSON.parse(row.data));
          
          // Transform flat agent data into the nested Customer -> Database structure
          const customerMap = {};
          for (const dbData of allAgentData) {
              const { customerId } = dbData;
              if (!customerMap[customerId]) {
                  customerMap[customerId] = {
                      id: customerId,
                      name: `Customer ${customerId}`, // In a real app, this name would come from your DB
                      databases: []
                  };
              }
              // The frontend expects a full Database object. The agent now provides this.
              customerMap[customerId].databases.push(dbData);
          }

          res.json(Object.values(customerMap));

      } catch (error) {
          console.error('Failed to fetch data for frontend:', error);
          res.status(500).json({ message: 'Internal server error while fetching data.' });
      }
  });

  return app;
}


// This block runs only when the script is executed directly (e.g., `npm start` or `node server.js`)
// It does not run when the file is `require`'d by Vite.
if (require.main === module) {
  const PORT = process.env.PORT || config.port;

  createExpressApp().then(app => {
    // --- Serve React Frontend for Production ---
    const buildPath = path.join(__dirname, '..', 'build');
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(buildPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          res.status(500).send("React app not built. Run `npm run build` in the root directory.");
        }
      });
    });

    app.listen(PORT, () => {
      console.log(`ProactiveDB Server listening on port ${PORT}`);
      console.log(`Mode: Production (serving API and built frontend from http://localhost:${PORT})`);
    });
  });
}

// Export the app creator function for Vite to use as middleware
module.exports = { createExpressApp };
