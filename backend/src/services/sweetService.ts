import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const reduceSweetStock = async (sweetId: number, quantity: number) => {
  const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });

  if (!sweet) {
    throw new Error("Sweet not found");
  }

  if (sweet.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  const updated = await prisma.sweet.update({
    where: { id: sweetId },
    data: {
      quantity: sweet.quantity - quantity
    }
  });

  return updated;
};

// 🟩 NEW — minimal update functionality
export const updateSweet = async (
  sweetId: number,
  data: {
    name?: string;
    category?: string;
    price?: number;
    quantity?: number;
  }
) => {
  const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });

  if (!sweet) {
    throw new Error("Sweet not found");
  }

  const updated = await prisma.sweet.update({
    where: { id: sweetId },
    data
  });

  return updated;
};


export const deleteSweet = async (sweetId: number) => {
  const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });

  if (!sweet) {
    throw new Error("Sweet not found");
  }

  await prisma.sweet.delete({ where: { id: sweetId } });

  return true;
};

export const listSweets = async ({
  category,
  search,
  page = 1,
  limit = 10,
}: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const where: any = {};

  if (category && category.trim() !== "") {
    where.category = category;
  }

  // FIXED for SQLite — remove mode: "insensitive"
  if (search && search.trim() !== "") {
    where.name = {
      contains: search,
    };
  }

  const skip = (page - 1) * limit;

  const sweets = await prisma.sweet.findMany({
    where,
    skip,
    take: limit,
  });

  return sweets;
};

export const getSweetById = async (sweetId: number) => {
  const sweet = await prisma.sweet.findUnique({
    where: { id: sweetId }
  });

  if (!sweet) {
    throw new Error("Sweet not found");
  }

  return sweet;
};
