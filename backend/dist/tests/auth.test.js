"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe("Auth Flow (TDD RED Phase)", () => {
    beforeAll(async () => {
        await prisma.order.deleteMany();
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    it("should register a new user and return a JWT token", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/register")
            .send({
            email: "testuser@example.com",
            password: "password123",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });
    it("should login an existing user and return a JWT token", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({
            email: "testuser@example.com",
            password: "password123",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });
});
