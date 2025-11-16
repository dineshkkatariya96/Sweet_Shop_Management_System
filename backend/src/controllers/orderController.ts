import { Request, Response } from "express";
import { getUserOrders, getAllOrders } from "../services/orderService";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const getUserOrderHistory = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const orders = await getUserOrders(decoded.userId);
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const getAdminOrderHistory = async (req: any, res: any) => {
  try {
    const orders = await getAllOrders();
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
