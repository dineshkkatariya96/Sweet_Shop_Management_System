"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
describe("Order History (TDD RED Phase)", () => {
    let userToken;
    let adminToken;
    let sweetId;
    beforeAll(async () => {
        await prisma.order.deleteMany();
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
        const passwordHash = await bcrypt_1.default.hash("password123", 10);
        await prisma.user.create({
            data: { email: "admin@example.com", passwordHash, role: "ADMIN" }
        });
        const user = await prisma.user.create({
            data: { email: "user@example.com", passwordHash, role: "USER" }
        });
        const sweet = await prisma.sweet.create({
            data: { name: "Ladoo", category: "Festive", price: 100, quantity: 20 }
        });
        sweetId = sweet.id;
        const loginAdmin = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: "admin@example.com", password: "password123" });
        adminToken = loginAdmin.body.token;
        const loginUser = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: "user@example.com", password: "password123" });
        userToken = loginUser.body.token;
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    it("should create an order when a sweet is purchased", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ quantity: 2 });
        expect(res.statusCode).toBe(200);
        const order = await prisma.order.findFirst();
        expect(order).not.toBeNull();
        expect(order?.sweetId).toBe(sweetId);
        expect(order?.quantity).toBe(2);
    });
    it("should allow USER to view their order history", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/orders")
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.orders.length).toBe(1);
    });
    it("should allow ADMIN to view all orders", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/admin/orders")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.orders.length).toBe(1);
    });
});
