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
import { restockSweetController } from "../controllers/sweetController";

const router = Router();

router.get("/", listSweetsController);
router.get("/:id", getSweetController);
router.post("/", adminOnly, createSweetController);
router.put("/:id", adminOnly, updateSweetController);
router.delete("/:id", adminOnly, deleteSweetController);
router.post("/:id/purchase", purchaseSweetController);
router.delete("/:id", adminOnly, deleteSweetController);
router.get("/search", listSweetsController);
router.post("/:id/restock", adminOnly, restockSweetController);

export default router;
