// src/controllers/orderController.ts
import { Request, Response } from "express";
import * as service from "../services/sweetService"; // if your service functions live elsewhere, adjust import

export const getUserOrderHistory = async (req: any, res: Response) => {
  try {
    // Accept either req.user.id or req.user.userId
    const userId = req.user?.id ?? req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const orders = await service.getUserOrders(userId);
    return res.status(200).json({ orders });
  } catch (err: any) {
    console.error("Error in getUserOrderHistory:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const getAdminOrderHistory = async (req: any, res: Response) => {
  try {
    const orders = await service.getAllOrders();
    return res.status(200).json({ orders });
  } catch (err: any) {
    console.error("Error in getAdminOrderHistory:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
