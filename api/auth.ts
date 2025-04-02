export default async function handler(req: Request): Promise<Response> {
  if (req.method === "POST") {
    try {
      const { username, password } = await req.json();

      // Validate credentials
      if (
        username === process.env.AUTH_USERNAME &&
        password === process.env.AUTH_PASSWORD
      ) {
        return new Response(JSON.stringify({ message: "Login successful" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ message: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      console.error("Error processing login request:", error);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
}