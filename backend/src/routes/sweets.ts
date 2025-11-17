import express from "express";
import Sweet from "../models/Sweet";
import Order from "../models/Order";
import { adminOnly } from "../middleware/adminOnly";
import { authenticate } from "../middleware/auth";
import * as service from "../services/sweetService";

const router = express.Router();

/* -------------------------------------------------------
   CREATE SWEET (ADMIN)
---------------------------------------------------------*/
router.post("/", authenticate, adminOnly, async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (price == null || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ message: "Price must be >= 0" });
    }

    if (quantity == null || isNaN(quantity) || Number(quantity) < 0) {
      return res.status(400).json({ message: "Quantity must be >= 0" });
    }

    const sweet = await Sweet.create({
      name,
      price: Number(price),
      quantity: Number(quantity),
      category,
    });

    return res.status(201).json({ sweet });
  } catch (err) {
    console.error("Create sweet error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------
   GET ALL SWEETS (WITH SEARCH + CATEGORY FILTER)
---------------------------------------------------------*/
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    const sweets = await Sweet.find(filter).sort({ createdAt: -1 });

    return res.json({ sweets });
  } catch (err) {
    console.error("Fetch sweets error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------
   GET SINGLE SWEET
---------------------------------------------------------*/
router.get("/:id", async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    return res.json({ sweet });
  } catch (err) {
    console.error("Fetch sweet error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------
   UPDATE SWEET (ADMIN)
---------------------------------------------------------*/
router.put("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;

    if (price != null && Number(price) < 0)
      return res.status(400).json({ message: "Price must be >= 0" });

    if (quantity != null && Number(quantity) < 0)
      return res.status(400).json({ message: "Quantity must be >= 0" });

    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      { name, price, quantity, category },
      { new: true }
    );

    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    return res.json({ sweet });
  } catch (err) {
    console.error("Update sweet error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------
   DELETE SWEET (ADMIN) – BLOCK IF ORDERS EXIST
---------------------------------------------------------*/
router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const hasOrder = await Order.findOne({ sweetId: req.params.id });

    if (hasOrder) {
      return res.status(400).json({
        error: "Cannot delete sweet. Orders exist for this sweet.",
      });
    }

    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    return res.json({ message: "Sweet deleted" });
  } catch (err) {
    console.error("Delete sweet error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------
   RESTOCK SWEET (ADMIN)
---------------------------------------------------------*/
router.post("/:id/restock", authenticate, adminOnly, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid restock amount" });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ error: "Sweet not found" });

    sweet.quantity += amount;
    await sweet.save();

    return res.json({
      message: "Sweet restocked successfully",
      sweet,
    });
  } catch (err) {
    console.error("Restock error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------------------------
   PURCHASE SWEET (USER)
---------------------------------------------------------*/
router.post("/:id/purchase", authenticate, async (req, res) => {
  try {
    const sweetId = req.params.id;
    const quantity = Number(req.body.quantity) || 1;
    const userId = req.user?.id;

    if (!userId)
      return res.status(401).json({ error: "Not authenticated" });

    if (quantity <= 0)
      return res.status(400).json({ error: "Invalid quantity" });

    const updatedSweet = await service.reduceSweetStock(sweetId, quantity);
    const order = await service.createOrder(userId, sweetId, quantity);

    return res.status(201).json({
      message: "Purchase completed",
      sweet: updatedSweet,
      order,
    });
  } catch (err: any) {
    console.error("Purchase error:", err);

    if (err.message === "Insufficient stock") {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
