import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

async function setupDatabase() {
  console.log("Connecting to database with URI:", process.env.POSTGRESQL_ADDON_URI);
  const pool = new Pool({
    connectionString: process.env.POSTGRESQL_ADDON_URI, // Use the full URI for connection
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    
    try {
       // Test the connection
       const result = await client.query("SELECT NOW()");
       console.log("Database connection successful:", result.rows[0]);
 
      // Create tasks table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(20) NOT NULL DEFAULT 'TODO',
          due_date TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create an index on status for faster filtering
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)
      `);

      console.log("Database setup completed successfully");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await pool.end();
  }
}

// Uncomment to run the setup
/* setupDatabase(); */