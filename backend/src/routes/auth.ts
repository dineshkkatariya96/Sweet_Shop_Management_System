import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await registerUser(email, password);
    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);
    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
