var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
export default function handler(req, res) {
    var _a, req_1, req_1_1;
    var _b, e_1, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method === "POST") {
            try {
                // Parse the request body
                let body = "";
                try {
                    for (_a = true, req_1 = __asyncValues(req); req_1_1 = yield req_1.next(), _b = req_1_1.done, !_b;) {
                        _d = req_1_1.value;
                        _a = false;
                        try {
                            const chunk = _d;
                            body += chunk;
                        }
                        finally {
                            _a = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_a && !_b && (_c = req_1.return)) yield _c.call(req_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                const { username, password } = JSON.parse(body);
                // Validate credentials
                if (username === process.env.AUTH_USERNAME &&
                    password === process.env.AUTH_PASSWORD) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Login successful" }));
                }
                else {
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Invalid credentials" }));
                }
            }
            catch (error) {
                console.error("Error processing login request:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
            }
        }
        else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Method not allowed" }));
        }
    });
}
