import { Request, Response } from "express";
import Sweet from "../models/Sweet";

export const createSweetController = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;

    // ========= Basic Validation =========
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!category || typeof category !== "string" || category.trim() === "") {
      return res.status(400).json({ message: "Category is required" });
    }

    if (price === undefined || price === null || isNaN(price)) {
      return res.status(400).json({ message: "Price must be a number" });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }

    if (quantity === undefined || quantity === null || isNaN(quantity)) {
      return res.status(400).json({ message: "Quantity must be a number" });
    }

    if (Number(quantity) < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    // ========= Create Sweet =========
    const sweet = await Sweet.create({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      quantity: Number(quantity),
    });

    return res.status(201).json({ sweet });
  } catch (err: any) {
    console.error("Create Sweet Error:", err);

    // Handle Mongoose validation errors (model-level)
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message || "Server error" });
  }
};
