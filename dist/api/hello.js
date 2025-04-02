"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handler(req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Hello, world!" }));
}
exports.default = handler;
