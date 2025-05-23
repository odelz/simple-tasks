import { getPool } from "@/lib/db"

// GET a single task by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const pool = getPool()
    const client = await pool.connect()

    try {
      const result = await client.query("SELECT * FROM tasks WHERE id = $1", [id])

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: "Task not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        })      }

        return new Response(JSON.stringify(result.rows[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Database error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch task" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// PUT update a task
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { title, description, status, due_date } = await request.json()

    // Validate status if provided
    if (status && !["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
      return new Response(JSON.stringify({ error: "Status must be one of: TODO, IN_PROGRESS, DONE" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const pool = getPool()
    const client = await pool.connect()

    try {
      // Build dynamic update query
      const updates: string[] = []
      const values: any[] = []

      if (title !== undefined) {
        updates.push(`title = $${values.length + 1}`)
        values.push(title)
      }

      if (description !== undefined) {
        updates.push(`description = $${values.length + 1}`)
        values.push(description)
      }

      if (status !== undefined) {
        updates.push(`status = $${values.length + 1}`)
        values.push(status)
      }

      if (due_date !== undefined) {
        updates.push(`due_date = $${values.length + 1}`)
        values.push(due_date ? new Date(due_date) : null)
      }

      // Always update the updated_at timestamp
      updates.push(`updated_at = $${values.length + 1}`)
      values.push(new Date())

      // Add the ID as the last parameter
      values.push(id)

      const query = `
        UPDATE tasks 
        SET ${updates.join(", ")} 
        WHERE id = $${values.length} 
        RETURNING *
      `

      const result = await client.query(query, values)

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: "Task not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        })
      }

      return new Response(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Database error:", error)
    return new Response(JSON.stringify({ error: "Failed to update task" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// PATCH update task status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status } = await request.json()

    // Validate status
    if (!status || !["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
      return new Response(JSON.stringify({ error: "Valid status (TODO, IN_PROGRESS, DONE) is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const pool = getPool()
    const client = await pool.connect()

    try {
      const result = await client.query(
        `UPDATE tasks 
         SET status = $1, updated_at = $2 
         WHERE id = $3 
         RETURNING *`,
        [status, new Date(), id],
      )

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: "Task not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        })
      }

      return new Response(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Database error:", error)
    return new Response(JSON.stringify({ error: "Failed to update task status" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// DELETE a task
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const pool = getPool()
    const client = await pool.connect()

    try {
      const result = await client.query("DELETE FROM tasks WHERE id = $1 RETURNING id", [id])

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: "Task not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        })
      }

      return new Response(JSON.stringify({ message: "Task deleted successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Database error:", error)
    return new Response(JSON.stringify({ error: "Failed to delete task" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

