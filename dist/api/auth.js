var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default function handler(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method === "POST") {
            try {
                const { username, password } = yield req.json();
                // Validate credentials
                if (username === process.env.AUTH_USERNAME &&
                    password === process.env.AUTH_PASSWORD) {
                    return new Response(JSON.stringify({ message: "Login successful" }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                else {
                    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
                        status: 401,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }
            catch (error) {
                console.error("Error processing login request:", error);
                return new Response(JSON.stringify({ message: "Internal Server Error" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        else {
            return new Response(JSON.stringify({ message: "Method not allowed" }), {
                status: 405,
                headers: { "Content-Type": "application/json" },
            });
        }
    });
}
