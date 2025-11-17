import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ message: "Invalid authorization format" });

  const token = parts[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const id = decoded?.userId ?? decoded?.id;
    if (!id) return res.status(401).json({ message: "Invalid token payload" });

    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: "Invalid user" });
    if (user.role !== "ADMIN") return res.status(403).json({ message: "Not admin" });

    (req as any).user = { id: user._id.toString(), email: user.email, role: user.role };
    next();
  } catch (err) {
    console.error("Admin middleware:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
