import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// User can see only their orders
export const getUserOrders = async (userId: number) => {
  return prisma.order.findMany({
    where: { userId },
    include: { sweet: true },
  });
};

// Admin can see all orders
export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: { sweet: true, user: true },
  });
};
