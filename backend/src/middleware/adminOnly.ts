import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ error: "Not allowed" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
