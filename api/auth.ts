export default async function handler(req: any, res: any): Promise<void> {
  console.log("AUTH_USERNAME:", process.env.AUTH_USERNAME);
console.log("AUTH_PASSWORD:", process.env.AUTH_PASSWORD);
  try {
    console.log("Request method:", req.method);

    if (req.method === "POST") {
      // Parse the request body
      let body = "";
      for await (const chunk of req) {
        body += chunk;
      }

      console.log("Raw body:", body);

      const { username, password } = JSON.parse(body);

      console.log("Parsed username:", username);
      console.log("Parsed password:", password);

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