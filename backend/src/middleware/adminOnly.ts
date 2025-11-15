import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// VERY IMPORTANT: Use the same secret used by signToken()
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Only ADMIN allowed
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ error: "Not allowed" });
    }

    // Attach user to request if needed later
    req.body.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
