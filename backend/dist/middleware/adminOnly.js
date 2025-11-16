"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminOnly = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const token = header.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        if (decoded.role !== "ADMIN") {
            return res.status(403).json({ error: "Not allowed" });
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};
exports.adminOnly = adminOnly;
