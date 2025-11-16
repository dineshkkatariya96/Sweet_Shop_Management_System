import { Request, Response } from "express";
import { 
  reduceSweetStock,
  updateSweet,
  createOrder,
  deleteSweet,
  listSweets,
  getSweetById,
  restockSweet
} from "../services/sweetService";
import jwt from "jsonwebtoken";

export const purchaseSweetController = async (req: any, res: any) => {
  const sweetId = Number(req.params.id);
  const { quantity } = req.body;

  try {
    // Decode user from token
    const token = req.headers.authorization?.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

    const updated = await reduceSweetStock(sweetId, quantity);

    // Create order for user
    await createOrder(decoded.userId, sweetId, quantity);

    return res.status(200).json({ updated });
  } catch (error: any) {
    if (error.message === "Insufficient stock") {
      return res.status(400).json({ error: error.message });
    }
    return res.status(404).json({ error: error.message });
  }
};

// UPDATE sweet
export const updateSweetController = async (req: Request, res: Response) => {
  try {
    const sweetId = Number(req.params.id);

    const updated = await updateSweet(sweetId, req.body);

    return res.status(200).json({ sweet: updated });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// DELETE sweet
export const deleteSweetController = async (req: Request, res: Response) => {
  try {
    const sweetId = Number(req.params.id);

    const result = await deleteSweet(sweetId);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// LIST sweets + SEARCH
export const listSweetsController = async (req: any, res: any) => {
  try {
    const category = req.query.category ? String(req.query.category) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const sweets = await listSweets({ category, search, page, limit });

    return res.status(200).json({ sweets });
  } catch (error: any) {
    console.error("LIST ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

// GET single sweet
export const getSweetController = async (req: any, res: any) => {
  const sweetId = Number(req.params.id);

  try {
    const sweet = await getSweetById(sweetId);
    return res.status(200).json({ sweet });
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};

// RESTOCK sweet (Admin Only)
export const restockSweetController = async (req: any, res: any) => {
  try {
    const sweetId = Number(req.params.id);
    const { amount } = req.body;

    const updated = await restockSweet(sweetId, amount);

    return res.status(200).json({
      message: "Sweet restocked successfully",
      sweet: updated,
    });

  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
