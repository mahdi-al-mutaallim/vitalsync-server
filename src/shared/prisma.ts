import { type Admin, type Prisma, PrismaClient, UserRole, UserStatus } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

export { prisma, UserStatus, UserRole, type Prisma, type Admin };
