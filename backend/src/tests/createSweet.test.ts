import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Create Sweet (TDD RED Phase)", () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Clean DB
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create Admin
    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        passwordHash: "password123",
        role: "ADMIN"
      }
    });

    // Create User
    const user = await prisma.user.create({
      data: {
        email: "user@example.com",
        passwordHash: "password123",
        role: "USER"
      }
    });

    // Login Admin
    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@example.com",
        password: "password123"
      });

    adminToken = adminLogin.body.token;

    // Login User
    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "user@example.com",
        password: "password123"
      });

    userToken = userLogin.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should allow ADMIN to create a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Kaju Katli",
        category: "Dry Fruit",
        price: 500,
        quantity: 20
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.sweet.name).toBe("Kaju Katli");
  });

  it("should NOT allow USER to create a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Kaju Katli",
        category: "Dry Fruit",
        price: 500,
        quantity: 20
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Not allowed");
  });
});
