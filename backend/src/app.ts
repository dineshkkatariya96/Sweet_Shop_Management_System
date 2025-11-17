// src/app.ts
import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth";
import sweetsRoutes from "./routes/sweets";
import orderRoutes from "./routes/orders";
import adminOrderRoutes from "./routes/adminOrders";

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://sweet-shop-management-system-aqbt.vercel.app",
  "https://sweet-shop-management-system-aqbt-1qniasq9r.vercel.app",
  "https://sweet-shop-management-system-beta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser requests (like Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ BLOCKED BY CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  })
);


// body parser
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/orders", orderRoutes);

// health
app.get("/", (_req, res) => res.json({ message: "Sweet Shop API (MongoDB)" }));

// basic error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// start server + connect mongoose
const PORT = parseInt(process.env.PORT || "3000", 10);
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sweetshop";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connect error:", err);
    process.exit(1);
  });

export default app;
