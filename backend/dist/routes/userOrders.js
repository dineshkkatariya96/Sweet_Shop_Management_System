"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
// USER → /api/orders
router.get("/", orderController_1.getUserOrderHistory);
exports.default = router;
