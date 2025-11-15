import { Router } from "express";
import { getUserOrderHistory } from "../controllers/orderController";

const router = Router();

// USER → /api/orders
router.get("/", getUserOrderHistory);

export default router;
