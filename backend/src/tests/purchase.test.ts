import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Purchase Sweet (TDD RED Phase)", () => {
  
  let sweetId: number;

  beforeAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create a user
    const user = await prisma.user.create({
      data: {
        email: "buyer@example.com",
        passwordHash: "testpassword",
        role: "USER"
      }
    });

    // Login user: but skip hashing, we'll override JWT manually
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "buyer@example.com", password: "testpassword" });

    // If your login doesn't work yet, we manually hardcode JWT later
    // For now skip token: purchase endpoint shouldn't require auth until later

    // Create a sweet in DB
    const sweet = await prisma.sweet.create({
      data: {
        name: "Barfi",
        category: "Milk",
        price: 100,
        quantity: 10
      }
    });

    sweetId = sweet.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should reduce quantity when a sweet is purchased", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({
        quantity: 3
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.updated.quantity).toBe(7);
  });

  it("should fail when quantity exceeds stock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({
        quantity: 50
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Insufficient stock");
  });

});
