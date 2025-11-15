import { Router } from "express";
import { purchaseSweetController } from "../controllers/sweetController";

const router = Router();

router.post("/:id/purchase", purchaseSweetController);

export default router;
