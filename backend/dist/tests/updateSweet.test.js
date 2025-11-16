"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
describe("Update Sweet (TDD GREEN Phase)", () => {
    let adminToken;
    let userToken;
    let sweetId;
    beforeAll(async () => {
        // Clean DB
        await prisma.order.deleteMany();
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
        // Create ADMIN
        const adminPassword = await bcrypt_1.default.hash("admin123", 10);
        const admin = await prisma.user.create({
            data: {
                email: "admin@example.com",
                passwordHash: adminPassword,
                role: "ADMIN",
            },
        });
        adminToken = jsonwebtoken_1.default.sign({ userId: admin.id, email: admin.email, role: "admin".toUpperCase() }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        // Create USER
        const userPassword = await bcrypt_1.default.hash("user123", 10);
        const user = await prisma.user.create({
            data: {
                email: "user@example.com",
                passwordHash: userPassword,
                role: "USER",
            },
        });
        userToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: "user".toUpperCase() }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        // Create sample sweet
        const sweet = await prisma.sweet.create({
            data: {
                name: "Gulab Jamun",
                category: "Milk",
                price: 100,
                quantity: 20,
            },
        });
        sweetId = sweet.id;
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    it("should allow ADMIN to update a sweet", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
            name: "Updated Gulab Jamun",
            price: 150,
            quantity: 30,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.sweet.name).toBe("Updated Gulab Jamun");
        expect(res.body.sweet.price).toBe(150);
        expect(res.body.sweet.quantity).toBe(30);
    });
    it("should NOT allow USER to update a sweet", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
            name: "Should Not Update",
        });
        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("Not allowed");
    });
    it("should return 400 for price <= 0", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
            price: -10,
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Price must be greater than 0");
    });
    it("should return 400 for negative quantity", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
            quantity: -5,
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Quantity cannot be negative");
    });
    it("should return 400 for non-existing sweet", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/sweets/999999`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
            name: "Does Not Exist",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Sweet not found");
    });
});
