"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSweetController = void 0;
const createSweetService_1 = require("../services/createSweetService");
const createSweetController = async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;
        const sweet = await (0, createSweetService_1.createSweet)({
            name,
            category,
            price,
            quantity,
        });
        return res.status(201).json({ sweet });
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to create sweet" });
    }
};
exports.createSweetController = createSweetController;
