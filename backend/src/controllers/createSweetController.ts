import { Request, Response } from "express";
import { createSweet } from "../services/createSweetService";

export const createSweetController = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;

    const sweet = await createSweet({
      name,
      category,
      price,
      quantity,
    });

    return res.status(201).json({ sweet });
  } catch (err: any) {
    // Return 400 for validation errors (e.g., negative quantity)
    if (err.message === "Quantity cannot be negative") {
      return res.status(400).json({ error: err.message });
    }

    if (err.message === "Price cannot be negative") {
      return res.status(400).json({ error: err.message });
    }
    
    return res.status(500).json({ error: "Failed to create sweet" });
  }
};
