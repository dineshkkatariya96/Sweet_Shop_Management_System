"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await (0, authController_1.registerUser)(email, password);
        return res.status(200).json(result);
    }
    catch (e) {
        return res.status(400).json({ error: e.message });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await (0, authController_1.loginUser)(email, password);
        return res.status(200).json(result);
    }
    catch (e) {
        return res.status(400).json({ error: e.message });
    }
});
exports.default = router;
