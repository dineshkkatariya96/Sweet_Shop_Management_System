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
describe("Purchase Sweet (TDD RED Phase)", () => {
    let sweetId;
    let userToken;
    beforeAll(async () => {
        await prisma.order.deleteMany();
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
        const passwordHash = await bcrypt_1.default.hash("password123", 10);
        await prisma.user.create({
            data: { email: "testuser@example.com", passwordHash, role: "USER" }
        });
        const login = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: "testuser@example.com", password: "password123" });
        userToken = login.body.token;
        const sweet = await prisma.sweet.create({
            data: {
                name: "Gulab Jamun",
                category: "Milk",
                price: 100,
                quantity: 10,
            }
        });
        sweetId = sweet.id;
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    it("should reduce quantity when a sweet is purchased", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ quantity: 3 });
        expect(res.statusCode).toBe(200);
        expect(res.body.updated.quantity).toBe(7);
    });
    it("should fail when quantity exceeds stock", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ quantity: 100 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Insufficient stock");
    });
});
