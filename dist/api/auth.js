"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handler(req, res) {
    if (req.method === "POST") {
        const { username, password } = req.body;
        // Validate credentials
        if (username === process.env.AUTH_USERNAME &&
            password === process.env.AUTH_PASSWORD) {
            res.status(200).json({ message: "Login successful" });
        }
        else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
exports.default = handler;
