import { Router } from "express";
import { getUserOrderHistory, getAdminOrderHistory } from "../controllers/orderController";

const router = Router();

// USER → /api/orders
router.get("/", getUserOrderHistory);

// ADMIN → /api/admin/orders
router.get("/", getAdminOrderHistory);

export default router;
