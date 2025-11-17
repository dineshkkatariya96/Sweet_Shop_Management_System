// src/routes/adminOrders.ts
import { Router } from "express";
import { getAdminOrderHistory } from "../controllers/orderController";
import { authenticate } from "../middleware/auth";
import { adminOnly } from "../middleware/adminOnly";

const router = Router();

router.get("/", authenticate, adminOnly, getAdminOrderHistory);

export default router;
