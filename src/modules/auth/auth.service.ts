import { UserStatus } from "@generated/prisma";
import { jwt_helpers } from "@helpers/jwt-helper";
import prisma from "@shared/prisma";
import bcrypt from "bcrypt";
import type { JwtPayload } from "jsonwebtoken";

const login_user = async (payload: { email: string; password: string }) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: {
			email: payload.email,
			status: UserStatus.ACTIVE,
		},
	});
	const isCorrectPassword: boolean = await bcrypt.compare(
		payload.password,
		userData.password,
	);
	if (!isCorrectPassword) {
		throw new Error("Incorrect email or password");
	}
	const access_token = jwt_helpers.generate_token(
		{ email: userData.email, role: userData.role },
		"abcdefg",
		"5m",
	);
	const refresh_token = jwt_helpers.generate_token(
		{ email: userData.email, role: userData.role },
		"abcdefghijktuvwxyz",
		"30d",
	);
	return {
		access_token,
		refresh_token,
		needs_password_changed: userData.needPasswordChange,
	};
};

const token_refresher = async (token: string) => {
	let decoded: JwtPayload;
	try {
		decoded = jwt_helpers.verify_token(
			token,
			"abcdefghijktuvwxyz",
		) as JwtPayload;
	} catch (error) {
		console.error(error);
		throw new Error("You are not authorized");
	}
	const UserData = await prisma.user.findUniqueOrThrow({
		where: {
			email: decoded?.["email"],
			status: UserStatus.ACTIVE,
		},
	});
	const access_token = jwt_helpers.generate_token(
		{ email: UserData.email, role: UserData.role },
		"abcdefg",
		"5m",
	);
	return {
		access_token,
		needs_password_changed: UserData.needPasswordChange,
	};
};

export const auth_services = {
	login_user,
	token_refresher,
};
