import express from "express";
import { adminOnly } from "../middleware/adminOnly";
import Order from "../models/Order";

const router = express.Router();

router.get("/orders", adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("sweet")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Admin orders error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
