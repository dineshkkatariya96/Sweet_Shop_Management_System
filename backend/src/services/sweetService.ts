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