import bcrypt from "bcrypt";
import { prisma, UserRole } from "@/shared/prisma.js";

const seedSuperAdmin = async () => {
	try {
		const userCount = await prisma.user.count();

		if (userCount > 0) {
			console.log("Users already exist. Skipping super admin seeding.");
			return;
		}

		const payload = {
			password: "Gh3*Tf9m",
			admin: {
				name: "Mahdi Al Mutaallim",
				email: "thecodermehedi@gmail.com",
				contactNo: "01234567891",
			},
		};

		const hashedPassword: string = await bcrypt.hash(payload.password, 12);
		const newUser = {
			email: payload.admin.email,
			password: hashedPassword,
			role: UserRole.SUPERADMIN,
		};

		await prisma.$transaction(async (tsx) => {
			await tsx.user.create({ data: newUser });
			await tsx.admin.create({ data: payload.admin });
		});

		console.log("✅ Super admin seeded successfully.");
	} catch (error) {
		console.error("❌ Failed to seed super admin:", error);
	}
};

export default seedSuperAdmin;
