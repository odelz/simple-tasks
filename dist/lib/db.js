"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = void 0;
const pg_1 = require("pg");
// Create a singleton pool that can be reused across requests
let pool;
function getPool() {
    if (!pool) {
        pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
        });
        // Handle pool errors
        pool.on("error", (err) => {
            console.error("Unexpected error on idle client", err);
            process.exit(-1);
        });
    }
    return pool;
}
exports.getPool = getPool;
