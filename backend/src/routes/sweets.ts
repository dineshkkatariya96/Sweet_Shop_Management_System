import { Router } from "express";
import { purchaseSweetController, updateSweetController, deleteSweetController } from "../controllers/sweetController";
import { createSweetController } from "../controllers/createSweetController";
import { adminOnly } from "../middleware/adminOnly";

const router = Router();

router.post("/", adminOnly, createSweetController);
router.put("/:id", adminOnly, updateSweetController);
router.delete("/:id", adminOnly, deleteSweetController);
router.post("/:id/purchase", purchaseSweetController);

export default router;
