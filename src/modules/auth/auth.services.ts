import bcrypt from "bcrypt";
import { config } from "@/config/index.js";
import { jwtHelpers } from "@/helpers/jwtHelpers.js";
import appError from "@/shared/appError.js";
import httpStatus from "@/shared/httpStatus.js";
import { prisma, UserStatus } from "@/shared/prisma.js";
import type { AuthTokens, JwtUserPayload, LoginPayload, NewAccessTokenResult } from "./auth.types.js";

const loginUserFromDB = async (payload: LoginPayload): Promise<AuthTokens> => {
	const { needPasswordChange, password, email, role } = await prisma.user.findUniqueOrThrow({
		where: { email: payload.email, status: UserStatus.ACTIVE },
	});
	const isCorrectPassword: boolean = await bcrypt.compare(payload.password, password);
	if (!isCorrectPassword) {
		throw new appError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
	}
	const accessToken = jwtHelpers.generateToken({ email, role }, config.accessTokenSecret, config.accessTokenExpiresIn);
	const refreshToken = jwtHelpers.generateToken(
		{ email, role },
		config.refreshTokenSecret,
		config.refreshTokenExpiresIn,
	);
	return { accessToken, refreshToken, needsPasswordChange: needPasswordChange };
};

const getNewAccessTokenByRefreshToken = async (token: string): Promise<NewAccessTokenResult> => {
	let decoded: JwtUserPayload;
	try {
		decoded = jwtHelpers.verifyToken(token, config.refreshTokenSecret) as JwtUserPayload;
	} catch (error) {
		console.error(error);
		throw new appError(httpStatus.UNAUTHORIZED, "You are not authorized");
	}

	const { email, role, needPasswordChange } = await prisma.user.findUniqueOrThrow({
		where: { email: decoded.email, status: UserStatus.ACTIVE },
	});

	const accessToken = jwtHelpers.generateToken({ email, role }, config.accessTokenSecret, "5m");

	return { accessToken, needsPasswordChange: needPasswordChange };
};

export const AuthServices = {
	loginUserFromDB,
	getNewAccessTokenByRefreshToken,
};
