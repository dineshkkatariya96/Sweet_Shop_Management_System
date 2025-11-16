import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

describe("Create Sweet (TDD RED → GREEN Phase)", () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    await prisma.order.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash("password123", 10);

    await prisma.user.create({
      data: { email: "admin@example.com", passwordHash, role: "ADMIN" }
    });

    await prisma.user.create({
      data: { email: "user@example.com", passwordHash, role: "USER" }
    });

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

  it("should allow ADMIN to create a sweet", async () => {
    const res = await request(app)
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
    const res = await request(app)
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
