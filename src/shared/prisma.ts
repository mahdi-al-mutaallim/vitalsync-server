import {
	type Admin,
	type Prisma,
	PrismaClient,
	UserStatus,
} from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

export { prisma, UserStatus, type Prisma, type Admin };
