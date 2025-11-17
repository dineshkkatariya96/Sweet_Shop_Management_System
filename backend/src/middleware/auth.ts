// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; userId?: string; email?: string; role?: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token provided" });

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ message: "Invalid authorization format" });

  const token = parts[1];

  try {
    const secret = process.env.JWT_SECRET || "secret";
    console.log("[Auth] verifying token:", token ? token.substring(0, 20) + "..." : "null", "using secret:", secret ? "present" : "missing");

    const decoded = jwt.verify(token, secret) as any;
    console.log("[Auth] decoded payload:", decoded);

    const id = decoded?.userId ?? decoded?.id;
    if (!id) {
      console.warn("[Auth] token has no userId/id");
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Attach both forms so controllers can use either req.user.id or req.user.userId
    req.user = { id: id.toString(), userId: id.toString(), email: decoded?.email, role: decoded?.role };
    return next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
