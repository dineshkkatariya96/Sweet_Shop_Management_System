"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.getUserOrders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// User can see only their orders
const getUserOrders = async (userId) => {
    return prisma.order.findMany({
        where: { userId },
        include: { sweet: true },
    });
};
exports.getUserOrders = getUserOrders;
// Admin can see all orders
const getAllOrders = async () => {
    return prisma.order.findMany({
        include: { sweet: true, user: true },
    });
};
exports.getAllOrders = getAllOrders;
