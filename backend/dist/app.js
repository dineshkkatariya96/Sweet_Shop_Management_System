"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const sweets_1 = __importDefault(require("./routes/sweets"));
const orders_1 = __importDefault(require("./routes/orders"));
const adminOnly_1 = require("./middleware/adminOnly");
const userOrders_1 = __importDefault(require("./routes/userOrders"));
const adminOrders_1 = __importDefault(require("./routes/adminOrders"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/sweets", sweets_1.default);
app.use("/api/sweets", sweets_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/orders", userOrders_1.default);
// ADMIN order history
app.use("/api/admin/orders", adminOrders_1.default);
app.use("/api/orders", orders_1.default);
app.use("/api/admin/orders", adminOnly_1.adminOnly, orders_1.default);
app.get("/", (req, res) => {
    res.json({ message: "Sweet Shop API" });
});
exports.default = app;
