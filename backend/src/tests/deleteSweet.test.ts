import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

describe("Delete Sweet (TDD GREEN Phase)", () => {
  let adminToken: string;
  let userToken: string;
  let sweetId: number;
  let adminId: number;

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

    adminId = admin.id;

    adminToken = jwt.sign(
      { userId: admin.id, email: admin.email, role: "ADMIN" },
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
      { userId: user.id, email: user.email, role: "USER" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    // Create sweet for admin deletion test
    const sweet = await prisma.sweet.create({
      data: {
        name: "Kaju Barfi",
        category: "Milk",
        price: 200,
        quantity: 10,
      },
    });

    sweetId = sweet.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should allow ADMIN to delete a sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Sweet deleted successfully");

    const deleted = await prisma.sweet.findUnique({ where: { id: sweetId } });
    expect(deleted).toBeNull();
  });

  it("should NOT allow USER to delete a sweet", async () => {
    const sweet = await prisma.sweet.create({
      data: {
        name: "Ladoo",
        category: "Traditional",
        price: 50,
        quantity: 30,
      },
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet.id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Not allowed");
  });

  it("should return error if sweet does not exist", async () => {
    const res = await request(app)
      .delete(`/api/sweets/999999`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Sweet not found");
  });

  it("should NOT delete a sweet if it has existing orders", async () => {
    // Create a sweet
    const sweet = await prisma.sweet.create({
      data: {
        name: "Rasgulla",
        category: "Milk",
        price: 120,
        quantity: 50,
      },
    });

    // Create an order using **correct adminId**
    await prisma.order.create({
      data: {
        userId: adminId,
        sweetId: sweet.id,
        quantity: 2,
      },
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Cannot delete sweet with existing orders");
  });
});
