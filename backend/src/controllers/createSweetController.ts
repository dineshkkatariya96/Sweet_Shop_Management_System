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
    return res.status(500).json({ error: "Failed to create sweet" });
  }
};
