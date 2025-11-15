import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

describe("Update Sweet (TDD GREEN Phase)", () => {
  let adminToken: string;
  let userToken: string;
  let sweetId: number;

  beforeAll(async () => {
    // Clean DB
    await prisma.order.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create ADMIN
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        passwordHash: adminPassword,
        role: "ADMIN",
      },
    });

    adminToken = jwt.sign(
      { userId: admin.id, email: admin.email, role: "admin".toUpperCase() },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    // Create USER
    const userPassword = await bcrypt.hash("user123", 10);
    const user = await prisma.user.create({
      data: {
        email: "user@example.com",
        passwordHash: userPassword,
        role: "USER",
      },
    });

    userToken = jwt.sign(
      { userId: user.id, email: user.email, role: "user".toUpperCase() },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    // Create sample sweet
    const sweet = await prisma.sweet.create({
      data: {
        name: "Gulab Jamun",
        category: "Milk",
        price: 100,
        quantity: 20,
      },
    });

    sweetId = sweet.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should allow ADMIN to update a sweet", async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated Gulab Jamun",
        price: 150,
        quantity: 30,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet.name).toBe("Updated Gulab Jamun");
    expect(res.body.sweet.price).toBe(150);
    expect(res.body.sweet.quantity).toBe(30);
  });

  it("should NOT allow USER to update a sweet", async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Should Not Update",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Not allowed");
  });

  it("should return 400 for price <= 0", async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: -10,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Price must be greater than 0");
  });

  it("should return 400 for negative quantity", async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        quantity: -5,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Quantity cannot be negative");
  });

  it("should return 400 for non-existing sweet", async () => {
    const res = await request(app)
      .put(`/api/sweets/999999`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Does Not Exist",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Sweet not found");
  });
});
