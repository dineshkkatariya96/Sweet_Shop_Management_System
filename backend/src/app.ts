import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import sweetsRoutes from "./routes/sweets";
import orderRoutes from "./routes/orders";

import userOrderRoutes from "./routes/userOrders";
import adminOrderRoutes from "./routes/adminOrders";
import { adminOnly } from "./middleware/adminOnly";

const app = express();
app.use(express.json());

const raw = process.env.ALLOWED_ORIGINS || "http://localhost:5173";
const allowedOrigins = raw.split(",").map(s => s.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("CORS not allowed by server"));
  },
  credentials: true,
}));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);
app.use("/api/orders", userOrderRoutes);
app.use("/api/admin/orders", adminOnly, adminOrderRoutes);
app.use("/api/orders", orderRoutes);

// Health route
app.get("/", (req, res) => {
  res.json({ message: "Sweet Shop API is running" });
});


if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
