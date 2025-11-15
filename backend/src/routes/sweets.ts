import { Router } from "express";
import { purchaseSweetController, updateSweetController } from "../controllers/sweetController";
import { createSweetController } from "../controllers/createSweetController";
import { adminOnly } from "../middleware/adminOnly";

const router = Router();

router.post("/", adminOnly, createSweetController);
router.put("/:id", adminOnly, updateSweetController);
router.post("/:id/purchase", purchaseSweetController);

export default router;
