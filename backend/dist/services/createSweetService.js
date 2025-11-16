"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSweet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSweet = async (data) => {
    const sweet = await prisma.sweet.create({ data });
    return sweet;
};
exports.createSweet = createSweet;
