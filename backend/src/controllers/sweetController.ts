import { Request, Response } from "express";
import { reduceSweetStock, updateSweet ,createOrder} from "../services/sweetService";
import { deleteSweet } from "../services/sweetService";
import { listSweets } from "../services/sweetService";
import { getSweetById } from "../services/sweetService";
import jwt from "jsonwebtoken";

export const purchaseSweetController = async (req: any, res: any) => {
  const sweetId = Number(req.params.id);
  const { quantity } = req.body;

  try {
    // decode user from token
    const token = req.headers.authorization?.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

    const updated = await reduceSweetStock(sweetId, quantity);

    // GREEN: Create order
    await createOrder(decoded.userId, sweetId, quantity);

    return res.status(200).json({ updated });
  } catch (error: any) {
    if (error.message === "Insufficient stock") {
      return res.status(400).json({ error: error.message });
    }
    return res.status(404).json({ error: error.message });
  }
};

// 🟩 NEW — minimal update controller
export const updateSweetController = async (req: Request, res: Response) => {
  try {
    const sweetId = Number(req.params.id);

    const updated = await updateSweet(sweetId, req.body);

    return res.status(200).json({ sweet: updated });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
// GREEN — minimal delete controller
export const deleteSweetController = async (req: any, res: any) => {
  const sweetId = Number(req.params.id);

  try {
    await deleteSweet(sweetId);
    return res.status(200).json({ message: "Sweet deleted" });
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};

export const listSweetsController = async (req: any, res: any) => {
  try {
    const category = req.query.category ? String(req.query.category) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const sweets = await listSweets({ category, search, page, limit });

    return res.status(200).json({ sweets });
  } catch (error: any) {
    console.error("LIST ERROR:", error);   // 🔥 THIS SHOWS REAL PRISMA ERROR
    return res.status(500).json({ error: error.message });
  }
};


// GET single sweet (GREEN)
export const getSweetController = async (req: any, res: any) => {
  const sweetId = Number(req.params.id);

  try {
    const sweet = await getSweetById(sweetId);
    return res.status(200).json({ sweet });
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};

