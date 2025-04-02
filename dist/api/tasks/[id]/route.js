var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPool } from "@/lib/db";
// GET a single task by ID
export function GET(request, { params }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = params.id;
            const pool = getPool();
            const client = yield pool.connect();
            try {
                const result = yield client.query("SELECT * FROM tasks WHERE id = $1", [id]);
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
            return new Response(JSON.stringify({ error: "Failed to fetch task" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    });
}
// PUT update a task
export function PUT(request, { params }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = params.id;
            const { title, description, status, due_date } = yield request.json();
            // Validate status if provided
            if (status && !["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
                return new Response(JSON.stringify({ error: "Status must be one of: TODO, IN_PROGRESS, DONE" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
            const pool = getPool();
            const client = yield pool.connect();
            try {
                // Build dynamic update query
                const updates = [];
                const values = [];
                if (title !== undefined) {
                    updates.push(`title = $${values.length + 1}`);
                    values.push(title);
                }
                if (description !== undefined) {
                    updates.push(`description = $${values.length + 1}`);
                    values.push(description);
                }
                if (status !== undefined) {
                    updates.push(`status = $${values.length + 1}`);
                    values.push(status);
                }
                if (due_date !== undefined) {
                    updates.push(`due_date = $${values.length + 1}`);
                    values.push(due_date ? new Date(due_date) : null);
                }
                // Always update the updated_at timestamp
                updates.push(`updated_at = $${values.length + 1}`);
                values.push(new Date());
                // Add the ID as the last parameter
                values.push(id);
                const query = `
        UPDATE tasks 
        SET ${updates.join(", ")} 
        WHERE id = $${values.length} 
        RETURNING *
      `;
                const result = yield client.query(query, values);
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
// PATCH update task status
export function PATCH(request, { params }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = params.id;
            const { status } = yield request.json();
            // Validate status
            if (!status || !["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
                return new Response(JSON.stringify({ error: "Valid status (TODO, IN_PROGRESS, DONE) is required" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
            const pool = getPool();
            const client = yield pool.connect();
            try {
                const result = yield client.query(`UPDATE tasks 
         SET status = $1, updated_at = $2 
         WHERE id = $3 
         RETURNING *`, [status, new Date(), id]);
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
            return new Response(JSON.stringify({ error: "Failed to update task status" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    });
}
// DELETE a task
export function DELETE(request, { params }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = params.id;
            const pool = getPool();
            const client = yield pool.connect();
            try {
                const result = yield client.query("DELETE FROM tasks WHERE id = $1 RETURNING id", [id]);
                if (result.rows.length === 0) {
                    return new Response(JSON.stringify({ error: "Task not found" }), {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                return new Response(JSON.stringify({ message: "Task deleted successfully" }), {
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
            return new Response(JSON.stringify({ error: "Failed to delete task" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    });
}
