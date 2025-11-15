import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import sweetsRoutes from "./routes/sweets";
import orderRoutes from "./routes/orders";
import { adminOnly } from "./middleware/adminOnly";

import userOrderRoutes from "./routes/userOrders";
import adminOrderRoutes from "./routes/adminOrders";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);
app.use("/api/sweets", sweetsRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/orders", userOrderRoutes);

// ADMIN order history
app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin/orders", adminOnly, orderRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Sweet Shop API" });
});

export default app;
