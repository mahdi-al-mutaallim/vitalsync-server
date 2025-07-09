import bcrypt from "bcrypt";
import { config } from "@/config/index.js";
import ApiError from "@/errors/ApiError.js";
import { jwtHelpers } from "@/helpers/jwtHelpers.js";
import httpStatus from "@/shared/httpStatus.js";
import { prisma, UserStatus } from "@/shared/prisma.js";
import type { AuthTokens, JwtUserPayload, LoginPayload, NewAccessTokenResult } from "./auth.types.js";

const loginUserFromDB = async (payload: LoginPayload): Promise<AuthTokens> => {
	const { needsPasswordChange, password, email, role } = await prisma.user.findUniqueOrThrow({
		where: { email: payload.email, status: UserStatus.ACTIVE },
	});
	const isCorrectPassword: boolean = await bcrypt.compare(payload.password, password);
	if (!isCorrectPassword) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
	}
	const accessToken = jwtHelpers.generateToken({ email, role }, config.accessTokenSecret, config.accessTokenExpiresIn);
	const refreshToken = jwtHelpers.generateToken(
		{ email, role },
		config.refreshTokenSecret,
		config.refreshTokenExpiresIn,
	);
	return { accessToken, refreshToken, needsPasswordChange };
};

const getNewAccessTokenByRefreshToken = async (token: string): Promise<NewAccessTokenResult> => {
	let decoded: JwtUserPayload;
	try {
		decoded = jwtHelpers.verifyToken(token, config.refreshTokenSecret) as JwtUserPayload;
	} catch (error) {
		console.error(error);
		throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
	}

	const { email, role, needsPasswordChange } = await prisma.user.findUniqueOrThrow({
		where: { email: decoded.email, status: UserStatus.ACTIVE },
	});

	const accessToken = jwtHelpers.generateToken({ email, role }, config.accessTokenSecret, "5m");

	return { accessToken, needsPasswordChange };
};

export const AuthServices = {
	loginUserFromDB,
	getNewAccessTokenByRefreshToken,
};
