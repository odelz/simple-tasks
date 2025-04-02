import { URLSearchParams } from "url";

export default async function handler(req: any, res: any): Promise<void> {
  try {
    console.log("Request method:", req.method);

    // Add CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204).end(); // Handle preflight requests
      return;
    }

    if (req.method === "POST") {
      let body = req.body; // Initialize parsedBody with req.body
      const contentType = req.headers["content-type"];
      if (contentType === "application/x-www-form-urlencoded") {
        // Parse URL-encoded body
        const urlEncodedBody = new URLSearchParams(body);
        body = Object.fromEntries(urlEncodedBody.entries());
      }
      const username = body.username;
      const password = body.password;

      // Validate credentials
      if (
        username === process.env.AUTH_USERNAME &&
        password === process.env.AUTH_PASSWORD
      ) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Login successful" }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(( "Invalid credentials" ));
      }
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Method not allowed" }));
    }
  } catch (error) {
    console.error("Error processing login request:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
}