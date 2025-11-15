import { Router } from "express";
import { 
  purchaseSweetController, 
  updateSweetController, 
  deleteSweetController,
  listSweetsController,
  getSweetController
} from "../controllers/sweetController";
import { createSweetController } from "../controllers/createSweetController";
import { adminOnly } from "../middleware/adminOnly";

const router = Router();

router.get("/", listSweetsController);
router.get("/:id", getSweetController);
router.post("/", adminOnly, createSweetController);
router.put("/:id", adminOnly, updateSweetController);
router.delete("/:id", adminOnly, deleteSweetController);
router.post("/:id/purchase", purchaseSweetController);
router.put("/:id", adminOnly, updateSweetController);

export default router;
