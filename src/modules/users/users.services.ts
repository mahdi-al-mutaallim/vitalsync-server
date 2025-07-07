import bcrypt from "bcrypt";
import { prisma, UserRole } from "@/shared/prisma.js";
import type { CreateAdminBody } from "./users.types.js";

const createAdmin = async (payload: CreateAdminBody) => {
	const hashedPassword: string = await bcrypt.hash(payload.password, 12);
	const newUser = { email: payload.admin.email, password: hashedPassword, role: UserRole.ADMIN };
	return await prisma.$transaction(async (tsx) => {
		await tsx.user.create({ data: newUser });
		return await tsx.admin.create({ data: payload.admin });
	});
};

export const UserServices = {
	createAdmin,
};
