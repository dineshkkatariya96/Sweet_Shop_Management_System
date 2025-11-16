"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.getSweetById = exports.listSweets = exports.deleteSweet = exports.updateSweet = exports.reduceSweetStock = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const reduceSweetStock = async (sweetId, quantity) => {
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
exports.reduceSweetStock = reduceSweetStock;
// UPDATE SWEET (ADMIN)
const updateSweet = async (id, data) => {
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
exports.updateSweet = updateSweet;
const deleteSweet = async (id) => {
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
exports.deleteSweet = deleteSweet;
const listSweets = async ({ category, search, page = 1, limit = 10, }) => {
    const where = {};
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
exports.listSweets = listSweets;
const getSweetById = async (sweetId) => {
    const sweet = await prisma.sweet.findUnique({
        where: { id: sweetId }
    });
    if (!sweet) {
        throw new Error("Sweet not found");
    }
    return sweet;
};
exports.getSweetById = getSweetById;
const createOrder = async (userId, sweetId, quantity) => {
    return prisma.order.create({
        data: {
            userId,
            sweetId,
            quantity,
        },
    });
};
exports.createOrder = createOrder;
