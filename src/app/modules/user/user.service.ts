import { UserRole } from "@generated/prisma";
import prisma from "@shared/prisma";
import * as bcrypt from "bcrypt";

const createAdmin = async (data: any) => {
	const hashedPassword: string = await bcrypt.hash(data.password, 12);
	const userData = {
		email: data.admin.email,
		password: hashedPassword,
		role: UserRole.ADMIN,
	};
	const result = await prisma.$transaction(async (tsx) => {
		await tsx.user.create({ data: userData });
		const createdAdmin = await tsx.admin.create({
			data: data.admin,
		});
		return createdAdmin;
	});

	return result;
};

export const userService = {
	createAdmin,
};
