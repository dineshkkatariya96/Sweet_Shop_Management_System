import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBe(3);
  });

  it("should filter sweets by category", async () => {
    const res = await request(app).get("/api/sweets?category=Milk");

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBe(2);
  });

  it("should search sweets by name", async () => {
    const res = await request(app).get("/api/sweets?search=Kaju");

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBe(1);
    expect(res.body.sweets[0].name).toBe("Kaju Katli");
  });

  it("should paginate sweets", async () => {
    const res = await request(app).get("/api/sweets?page=1&limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBe(2);
  });
});
