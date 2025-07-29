import bcrypt from "bcryptjs";
import { config } from "@/config/index.js";
import { prisma, UserRole } from "@/shared/prisma.js";

const seed = async () => {
	try {
		const superadminCount = await prisma.user.count({ where: { role: UserRole.SUPERADMIN } });
		if (superadminCount === 0) {
			console.log("🌱 Seeding database…");
			console.log("✅ No MC account found — creating one…");
			const salt = await bcrypt.genSalt(config.superadminPassSalt);
			const password = await bcrypt.hash(config.superadminPass, salt);

			await prisma.$transaction(async (tsx) => {
				await tsx.user.create({ data: { email: config.superadminEmail, password, role: UserRole.SUPERADMIN } });
				await tsx.admin.create({
					data: { name: "Klein Moretti", email: config.superadminEmail, contactNo: "01234567891" },
				});
			});
			console.log(`🎉 MC account created: ${config.superadminEmail}/${config.superadminPass}`);
			console.log("✅ Seeding complete.");
		}
	} catch (error) {
		console.error("❌ Failed to seed super admin:", error);
	}
};

export default seed;
