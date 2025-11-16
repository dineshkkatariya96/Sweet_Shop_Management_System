"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const registerUser = async (email, password) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
        throw new Error("User already exists");
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, passwordHash, role: "USER" },
    });
    const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email, role: user.role });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("Invalid credentials");
    const match = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!match)
        throw new Error("Invalid credentials");
    const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email, role: user.role });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    };
};
exports.loginUser = loginUser;
