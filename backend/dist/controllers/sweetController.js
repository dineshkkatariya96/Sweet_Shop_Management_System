"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSweetController = exports.listSweetsController = exports.deleteSweetController = exports.updateSweetController = exports.purchaseSweetController = void 0;
const sweetService_1 = require("../services/sweetService");
const sweetService_2 = require("../services/sweetService");
const sweetService_3 = require("../services/sweetService");
const sweetService_4 = require("../services/sweetService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const purchaseSweetController = async (req, res) => {
    const sweetId = Number(req.params.id);
    const { quantity } = req.body;
    try {
        // decode user from token
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        const updated = await (0, sweetService_1.reduceSweetStock)(sweetId, quantity);
        // GREEN: Create order
        await (0, sweetService_1.createOrder)(decoded.userId, sweetId, quantity);
        return res.status(200).json({ updated });
    }
    catch (error) {
        if (error.message === "Insufficient stock") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(404).json({ error: error.message });
    }
};
exports.purchaseSweetController = purchaseSweetController;
// 🟩 NEW — minimal update controller
const updateSweetController = async (req, res) => {
    try {
        const sweetId = Number(req.params.id);
        const updated = await (0, sweetService_1.updateSweet)(sweetId, req.body);
        return res.status(200).json({ sweet: updated });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.updateSweetController = updateSweetController;
// GREEN — minimal delete controller
const deleteSweetController = async (req, res) => {
    try {
        const sweetId = Number(req.params.id);
        const result = await (0, sweetService_2.deleteSweet)(sweetId);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.deleteSweetController = deleteSweetController;
const listSweetsController = async (req, res) => {
    try {
        const category = req.query.category ? String(req.query.category) : undefined;
        const search = req.query.search ? String(req.query.search) : undefined;
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const sweets = await (0, sweetService_3.listSweets)({ category, search, page, limit });
        return res.status(200).json({ sweets });
    }
    catch (error) {
        console.error("LIST ERROR:", error); // 🔥 THIS SHOWS REAL PRISMA ERROR
        return res.status(500).json({ error: error.message });
    }
};
exports.listSweetsController = listSweetsController;
// GET single sweet (GREEN)
const getSweetController = async (req, res) => {
    const sweetId = Number(req.params.id);
    try {
        const sweet = await (0, sweetService_4.getSweetById)(sweetId);
        return res.status(200).json({ sweet });
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
};
exports.getSweetController = getSweetController;
