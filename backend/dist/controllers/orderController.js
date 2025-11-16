"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminOrderHistory = exports.getUserOrderHistory = void 0;
const orderService_1 = require("../services/orderService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const getUserOrderHistory = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const orders = await (0, orderService_1.getUserOrders)(decoded.userId);
        return res.status(200).json({ orders });
    }
    catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};
exports.getUserOrderHistory = getUserOrderHistory;
const getAdminOrderHistory = async (req, res) => {
    try {
        const orders = await (0, orderService_1.getAllOrders)();
        return res.status(200).json({ orders });
    }
    catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};
exports.getAdminOrderHistory = getAdminOrderHistory;
