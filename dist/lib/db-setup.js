var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;
function setupDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Connecting to database with URI:", process.env.POSTGRESQL_ADDON_URI);
        const pool = new Pool({
            connectionString: process.env.POSTGRESQL_ADDON_URI,
            ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
        });
        try {
            const client = yield pool.connect();
            try {
                // Test the connection
                const result = yield client.query("SELECT NOW()");
                console.log("Database connection successful:", result.rows[0]);
                // Create tasks table if it doesn't exist
                yield client.query(`
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
                yield client.query(`
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)
      `);
                console.log("Database setup completed successfully");
            }
            finally {
                client.release();
            }
        }
        catch (error) {
            console.error("Error setting up database:", error);
        }
        finally {
            yield pool.end();
        }
    });
}
// Uncomment to run the setup
/* setupDatabase(); */ 
