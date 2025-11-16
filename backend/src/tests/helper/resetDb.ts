import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const resetDb = async () => {
  await prisma.order.deleteMany();
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();
};
