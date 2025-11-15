import { Router } from "express";
import { purchaseSweet } from "../controllers/sweetController";

const router = Router();

router.post("/:id/purchase", async (req, res) => {
  const sweetId = Number(req.params.id);
  const { quantity } = req.body;

  try {
    const updated = await purchaseSweet(sweetId, quantity);
    return res.status(200).json({ updated });
  } catch (err: any) {
    if (err.message === "Insufficient stock") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(404).json({ error: err.message });
  }
});

export default router;
