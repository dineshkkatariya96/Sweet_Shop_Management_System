import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSweet = async (data: {
  name: string;
  category: string;
  price: number;
  quantity: number;
}) => {
  // Validate quantity is not negative
  if (data.quantity < 0) {
    throw new Error("Quantity cannot be negative");
  }
  if (data.price < 0) {
    throw new Error("Price cannot be negative");
  }
  const sweet = await prisma.sweet.create({ data });
  return sweet;
};
