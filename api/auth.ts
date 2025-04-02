import { URLSearchParams } from "url";

export default async function handler(req: any, res: any): Promise<void> {
  try {
    console.log("Request method:", req.method);
    console.log("Content-Type:", req.headers["content-type"]);

    // Add CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    if (req.method === "POST") {
      // Read the request body as a stream
      let rawBody = "";
      for await (const chunk of req) {
        rawBody += chunk;
      }
      console.log("Raw body:", rawBody);

      let parsedBody;
      const contentType = req.headers["content-type"];

      try {
        if (contentType?.includes("application/json")) {
          parsedBody = JSON.parse(rawBody);
        } else if (contentType?.includes("application/x-www-form-urlencoded")) {
          parsedBody = Object.fromEntries(new URLSearchParams(rawBody));
        } else {
          throw new Error(`Unsupported content type: ${contentType}`);
        }

        const { username, password } = parsedBody;
        console.log("Parsed username:", username);
        console.log("Parsed password:", password);

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
      } catch (parseError) {
        console.error("Body parsing error:", parseError);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ 
          message: "Invalid request body"
        }));
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