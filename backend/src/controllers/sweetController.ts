// src/controllers/sweetController.ts
import { Request, Response } from "express";
import * as service from "../services/sweetService";

export const listSweetsController = async (req: Request, res: Response) => {
  try {
    const category = req.query.category ? String(req.query.category) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const result = await service.listSweets({ category, search, page, limit });
    return res.status(200).json({ sweets: result.sweets, total: result.total, page, limit });
  } catch (err: any) {
    console.error("listSweetsController error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const getSweetController = async (req: Request, res: Response) => {
  try {
    const sweet = await service.getSweetById(req.params.id);
    return res.status(200).json({ sweet });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
};

export const createSweetController = async (req: Request, res: Response) => {
  try {
    const { name, price, quantity, category } = req.body;

    // Basic validation (server-side)
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }
    if (price == null || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ error: "Price must be a number >= 0" });
    }
    if (quantity == null || isNaN(quantity) || Number(quantity) < 0) {
      return res.status(400).json({ error: "Quantity must be a number >= 0" });
    }
    if (!category || typeof category !== "string" || category.trim() === "") {
      return res.status(400).json({ error: "Category is required" });
    }

    const s = await service.createSweet({
      name: name.trim(),
      price: Number(price),
      quantity: Number(quantity),
      category: category.trim(),
    });

    return res.status(201).json({ sweet: s });
  } catch (err: any) {
    console.error("createSweetController error:", err);
    // mongoose validation errors will appear here too
    return res.status(400).json({ error: err.message || "Bad request" });
  }
};

export const updateSweetController = async (req: Request, res: Response) => {
  try {
    const s = await service.updateSweet(req.params.id, req.body);
    return res.status(200).json({ sweet: s });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteSweetController = async (req: Request, res: Response) => {
  try {
    const r = await service.deleteSweet(req.params.id);
    return res.status(200).json(r);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
