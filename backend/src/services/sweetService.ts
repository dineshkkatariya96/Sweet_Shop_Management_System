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

// UPDATE SWEET (ADMIN)
export const updateSweet = async (
  id: number,
  data: {
    name?: string;
    category?: string;
    price?: number;
    quantity?: number;
  }
) => {
  // Validation
  if (data.price !== undefined && data.price <= 0) {
    throw new Error("Price must be greater than 0");
  }

  if (data.quantity !== undefined && data.quantity < 0) {
    throw new Error("Quantity cannot be negative");
  }

  // Ensure sweet exists
  const sweet = await prisma.sweet.findUnique({ where: { id } });
  if (!sweet) {
    throw new Error("Sweet not found");
  }

  const updated = await prisma.sweet.update({
    where: { id },
    data
  });

  return updated;
};

export const deleteSweet = async (id: number) => {
  // Check if sweet exists
  const sweet = await prisma.sweet.findUnique({ where: { id } });

  if (!sweet) {
    throw new Error("Sweet not found");
  }

  // Check foreign key orders
  const existingOrders = await prisma.order.findFirst({
    where: { sweetId: id }
  });

  if (existingOrders) {
    throw new Error("Cannot delete sweet with existing orders");
  }

  // Delete sweet
  await prisma.sweet.delete({
    where: { id }
  });

  return { message: "Sweet deleted successfully" };
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

export const createOrder = async (userId: number, sweetId: number, quantity: number) => {
  return prisma.order.create({
    data: {
      userId,
      sweetId,
      quantity,
    },
  });
};

export const restockSweet = async (id: number, amount: number) => {
  return prisma.sweet.update({
    where: { id },
    data: { quantity: { increment: amount } },
  });
};
