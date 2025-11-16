"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const adminOnly_1 = require("../middleware/adminOnly");
const router = (0, express_1.Router)();
// ADMIN → /api/admin/orders
router.get("/", adminOnly_1.adminOnly, orderController_1.getAdminOrderHistory);
exports.default = router;
