"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const db_1 = require("@/lib/db");
// GET all tasks with optional filtering
function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const dueBefore = searchParams.get("due_before");
        const dueAfter = searchParams.get("due_after");
        try {
            const pool = (0, db_1.getPool)();
            const client = yield pool.connect();
            try {
                let query = "SELECT * FROM tasks";
                const queryParams = [];
                const conditions = [];
                // Add filters if provided
                if (status) {
                    conditions.push(`status = $${queryParams.length + 1}`);
                    queryParams.push(status);
                }
                if (dueBefore) {
                    conditions.push(`due_date <= $${queryParams.length + 1}`);
                    queryParams.push(dueBefore);
                }
                if (dueAfter) {
                    conditions.push(`due_date >= $${queryParams.length + 1}`);
                    queryParams.push(dueAfter);
                }
                // Add WHERE clause if we have conditions
                if (conditions.length > 0) {
                    query += " WHERE " + conditions.join(" AND ");
                }
                // Add order by
                query += " ORDER BY due_date ASC NULLS LAST, created_at DESC";
                const result = yield client.query(query, queryParams);
                return new Response(JSON.stringify(result.rows), { status: 200, headers: { "Content-Type": "application/json" } });
            }
            finally {
                client.release();
            }
        }
        catch (error) {
            console.error("Database error:", error);
            return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    });
}
exports.GET = GET;
// POST create a new task
function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, description, status, due_date } = yield request.json();
            // Validate required fields
            if (!title) {
                return new Response(JSON.stringify({ error: "Title is required" }), { status: 400 });
            }
            // Validate status if provided
            if (status && !["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
                return new Response(JSON.stringify({ error: "Status must be one of: TODO, IN_PROGRESS, DONE" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
            const pool = (0, db_1.getPool)();
            const client = yield pool.connect();
            try {
                const result = yield client.query(`INSERT INTO tasks (title, description, status, due_date) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`, [title, description || null, status || "TODO", due_date ? new Date(due_date) : null]);
                if (result.rows.length === 0) {
                    return new Response(JSON.stringify({ error: "Task not found" }), {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                return new Response(JSON.stringify(result.rows[0]), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }
            finally {
                client.release();
            }
        }
        catch (error) {
            console.error("Database error:", error);
            return new Response(JSON.stringify({ error: "Failed to update task" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    });
}
exports.POST = POST;
