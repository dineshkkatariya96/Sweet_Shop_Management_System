"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe("List Sweets (TDD RED Phase)", () => {
    beforeAll(async () => {
        await prisma.order.deleteMany();
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
        await prisma.sweet.createMany({
            data: [
                { name: "Kaju Katli", category: "DryFruit", price: 500, quantity: 20 },
                { name: "Rasgulla", category: "Milk", price: 150, quantity: 50 },
                { name: "Barfi", category: "Milk", price: 200, quantity: 30 }
            ]
        });
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    it("should return all sweets", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/sweets");
        expect(res.statusCode).toBe(200);
        expect(res.body.sweets.length).toBe(3);
    });
    it("should filter sweets by category", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/sweets?category=Milk");
        expect(res.statusCode).toBe(200);
        expect(res.body.sweets.length).toBe(2);
    });
    it("should search sweets by name", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/sweets?search=Kaju");
        expect(res.statusCode).toBe(200);
        expect(res.body.sweets.length).toBe(1);
        expect(res.body.sweets[0].name).toBe("Kaju Katli");
    });
    it("should paginate sweets", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/sweets?page=1&limit=2");
        expect(res.statusCode).toBe(200);
        expect(res.body.sweets.length).toBe(2);
    });
});
