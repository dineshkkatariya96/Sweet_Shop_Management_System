import { Router } from "express";
import { getAdminOrderHistory } from "../controllers/orderController";
import { adminOnly } from "../middleware/adminOnly";

const router = Router();

// ADMIN → /api/admin/orders
router.get("/", adminOnly, getAdminOrderHistory);

export default router;
