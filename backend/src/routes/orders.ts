// src/routes/orders.ts
import { Router } from "express";
import { getUserOrderHistory } from "../controllers/orderController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Only user access here
router.get("/", authenticate, getUserOrderHistory);

export default router;
