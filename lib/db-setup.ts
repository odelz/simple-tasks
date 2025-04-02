import { Pool } from "pg"

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  })

  try {
    const client = await pool.connect()
    try {
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
      `)

      // Create an index on status for faster filtering
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)
      `)

      console.log("Database setup completed successfully")
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error setting up database:", error)
  } finally {
    await pool.end()
  }
}

// Uncomment to run the setup
setupDatabase()

