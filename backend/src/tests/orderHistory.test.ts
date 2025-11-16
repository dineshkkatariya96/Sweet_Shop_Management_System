import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

describe("Order History (TDD RED Phase)", () => {
  let userToken: string;
  let adminToken: string;
  let sweetId: number;

  beforeAll(async () => {
    await prisma.order.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash("password123", 10);

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

    const loginAdmin = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "password123" });

    adminToken = loginAdmin.body.token;

    const loginUser = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "password123" });

    userToken = loginUser.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create an order when a sweet is purchased", async () => {
    const res = await request(app)
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
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.orders.length).toBe(1);
  });

  it("should allow ADMIN to view all orders", async () => {
    const res = await request(app)
      .get("/api/admin/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.orders.length).toBe(1);
  });
});
