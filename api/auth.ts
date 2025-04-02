export default async function handler(req: any, res: any): Promise<void> {
  if (req.method === "POST") {
    try {
      // Parse the request body
      let body = "";
      for await (const chunk of req) {
        body += chunk;
      }
      const { username, password } = JSON.parse(body);

      // Validate credentials
      if (
        username === process.env.AUTH_USERNAME &&
        password === process.env.AUTH_PASSWORD
      ) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Login successful" }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid credentials" }));
      }
    } catch (error) {
      console.error("Error processing login request:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  } else {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Method not allowed" }));
  }
}