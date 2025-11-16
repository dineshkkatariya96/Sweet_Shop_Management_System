import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

describe("Purchase Sweet (TDD RED Phase)", () => {
  let sweetId: number;
  let userToken: string;

  beforeAll(async () => {
    await prisma.order.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash("password123", 10);

    await prisma.user.create({
      data: { email: "testuser@example.com", passwordHash, role: "USER" }
    });

    const login = await request(app)
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
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.updated.quantity).toBe(7);
  });

  it("should fail when quantity exceeds stock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 100 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Insufficient stock");
  });
});
