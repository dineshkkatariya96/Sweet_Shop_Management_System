"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDb = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const resetDb = async () => {
    await prisma.order.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
};
exports.resetDb = resetDb;
