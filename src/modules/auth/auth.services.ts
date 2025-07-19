import bcrypt from "bcrypt";
import { config } from "@/config/index.js";
import ApiError from "@/errors/ApiError.js";
import { jwtHelpers } from "@/helpers/jwtHelpers.js";
import httpStatus from "@/shared/httpStatus.js";
import { prisma, UserStatus } from "@/shared/prisma.js";
import { generateResetPasswordEmail } from "@/templates/generateResetPasswordEmail.js";
import type { AuthTokens, JwtUserPayload, LoginPayload, NewAccessTokenResult } from "./auth.types.js";
import { sendEmail } from "./auth.utils.js";

const loginUserFromDB = async (payload: LoginPayload): Promise<AuthTokens> => {
	const { needsPasswordChange, password, email, role, id } = await prisma.user.findUniqueOrThrow({
		where: { email: payload.email, status: UserStatus.ACTIVE },
	});
	const isCorrectPassword: boolean = await bcrypt.compare(payload.password, password);
	if (!isCorrectPassword) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
	}
	const accessToken = jwtHelpers.generateToken(
		{ id, email, role },
		config.accessTokenSecret,
		config.accessTokenExpiresIn,
	);
	const refreshToken = jwtHelpers.generateToken(
		{ id, email, role },
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

	const { email, role, needsPasswordChange, id } = await prisma.user.findUniqueOrThrow({
		where: { email: decoded.email, status: UserStatus.ACTIVE },
	});

	const accessToken = jwtHelpers.generateToken({ id, email, role }, config.accessTokenSecret, "5m");

	return { accessToken, needsPasswordChange };
};

const changePasswordIntoDB = async (user: JwtUserPayload, payload: { oldPassword: string; newPassword: string }) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: {
			email: user.email,
			status: UserStatus.ACTIVE,
		},
	});
	const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);
	if (!isCorrectPassword) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
	}
	const isSamePassword = await bcrypt.compare(payload.newPassword, userData.password);
	if (isSamePassword) {
		throw new ApiError(httpStatus.BAD_REQUEST, "New password must be different from the old one");
	}
	const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);
	return await prisma.user.update({
		where: {
			email: userData.email,
		},
		data: {
			password: hashedPassword,
			needsPasswordChange: false,
		},
	});
};

const sendResetPasswordEmail = async (email: string) => {
	const userData = await prisma.user.findUniqueOrThrow({ where: { email, status: UserStatus.ACTIVE } });
	const resetPassToken = jwtHelpers.generateToken(
		{ id: userData.id, type: "reset-password" },
		config.resetTokenSecret,
		config.resetTokenExpiresIn,
	);
	const resetLink = `${config.resetPasswordLinkPrefix}?token=${resetPassToken}`;
	const firstName = userData.email.split("@")[0] as string;
	const timeLimit = config.resetTokenExpiresIn;
	const template = await generateResetPasswordEmail({ firstName, resetLink, timeLimit });
	const result = await sendEmail(email, "Password Reset Request - VitalSync", template);
	return result;
};

export const resetPasswordIntoDB = async (token: string, password: string) => {
	const isValidToken = jwtHelpers.verifyToken<{ id: string; type: string }>(token, config.resetTokenSecret);
	if (!isValidToken) {
		throw new ApiError(httpStatus.FORBIDDEN, "Your reset token is not valid");
	}
	const userData = await prisma.user.findUniqueOrThrow({
		where: { id: isValidToken.id, status: UserStatus.ACTIVE },
	});
	const isSamePassword = await bcrypt.compare(password, userData.password);
	if (isSamePassword) {
		throw new ApiError(httpStatus.BAD_REQUEST, "You have already used this password once");
	}
	const hashedPassword: string = await bcrypt.hash(password, 12);
	return await prisma.user.update({
		where: { id: isValidToken.id, status: UserStatus.ACTIVE },
		data: { password: hashedPassword, needsPasswordChange: false },
	});
};

export const AuthServices = {
	loginUserFromDB,
	getNewAccessTokenByRefreshToken,
	changePasswordIntoDB,
	sendResetPasswordEmail,
	resetPasswordIntoDB,
};
