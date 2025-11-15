import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Auth Flow (TDD RED Phase)", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: "testuser@example.com" }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should register a new user and return a JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "testuser@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("testuser@example.com");
  });

  it("should login an existing user and return a JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("testuser@example.com");
  });
});
