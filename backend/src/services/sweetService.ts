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
