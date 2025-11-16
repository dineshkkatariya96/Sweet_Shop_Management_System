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
describe("Create Sweet (TDD RED → GREEN Phase)", () => {
    let adminToken;
    let userToken;
    beforeAll(async () => {
        await prisma.order.deleteMany();
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
        const passwordHash = await bcrypt_1.default.hash("password123", 10);
        await prisma.user.create({
            data: { email: "admin@example.com", passwordHash, role: "ADMIN" }
        });
        await prisma.user.create({
            data: { email: "user@example.com", passwordHash, role: "USER" }
        });
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
    it("should allow ADMIN to create a sweet", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/sweets")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
            name: "Jalebi",
            category: "Sugar",
            price: 120,
            quantity: 40
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.sweet.name).toBe("Jalebi");
    });
    it("should NOT allow USER to create a sweet", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/sweets")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
            name: "Imarti",
            category: "Sugar",
            price: 100,
            quantity: 30
        });
        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("Not allowed");
    });
});
