import bcrypt from "bcryptjs";
import { config } from "@/config/index.js";
import ApiError from "@/errors/ApiError.js";
import { jwtHelpers } from "@/helpers/jwtHelpers.js";
import sendEmail from "@/helpers/sendEmail.js";
import httpStatus from "@/shared/httpStatus.js";
import { prisma, UserStatus } from "@/shared/prisma.js";
import generateResetPasswordEmail from "@/templates/generateResetPasswordEmail.js";
import type { JwtTokenPayload } from "@/types/jwt.js";
import type { ChangePassword, LoginPayload } from "./auth.types.js";

const loginUserFromDB = async (payload: LoginPayload) => {
	const { id, needsPasswordChange, password, role } = await prisma.user.findUniqueOrThrow({
		where: { email: payload.email, status: UserStatus.ACTIVE },
	});
	const isCorrectPassword: boolean = await bcrypt.compare(payload.password, password);
	if (!isCorrectPassword) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
	}
	const jti = crypto.randomUUID();
	const accessToken = jwtHelpers.generateJwtToken({ sub: id, role, jti, type: "access" });
	const refreshToken = jwtHelpers.generateJwtToken({ sub: id, role, type: "refresh" });
	return { accessToken, refreshToken, needsPasswordChange };
};

const generateNewJwtToken = async (user: JwtTokenPayload) => {
	const { id, role } = await prisma.user.findUniqueOrThrow({
		where: { id: user.sub, status: UserStatus.ACTIVE },
	});
	const jti = crypto.randomUUID();
	const accessToken = jwtHelpers.generateJwtToken({ sub: id, role, jti, type: "access" });
	const refreshToken = jwtHelpers.generateJwtToken({ sub: id, role, type: "refresh" });
	return { accessToken, refreshToken };
};

const changePasswordIntoDB = async (user: JwtTokenPayload, payload: ChangePassword) => {
	const { id, password } = await prisma.user.findUniqueOrThrow({
		where: { id: user.sub, status: UserStatus.ACTIVE },
	});
	const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, password);
	if (!isCorrectPassword) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong current password");
	}
	const isSamePassword = await bcrypt.compare(payload.newPassword, password);
	if (isSamePassword) {
		throw new ApiError(httpStatus.BAD_REQUEST, "New password can’t be the same");
	}
	const hashed: string = await bcrypt.hash(payload.newPassword, await bcrypt.genSalt(12));
	return await prisma.user.update({ where: { id }, data: { password: hashed, needsPasswordChange: false } });
};

const sendResetPasswordEmail = async (email: string) => {
	const userData = await prisma.user.findUniqueOrThrow({ where: { email, status: UserStatus.ACTIVE } });
	const resetPassToken = jwtHelpers.generateJwtToken({ sub: userData.id, role: userData.role, type: "reset" });
	const resetLink = `${config.resetPasswordLinkPrefix}?token=${resetPassToken}`;
	const firstName = userData.email.split("@")[0] as string;
	const timeLimit = config.resetTokenExpiresIn;
	const template = await generateResetPasswordEmail({ firstName, resetLink, timeLimit });
	return await sendEmail(email, "Password Reset Request - VitalSync", template);
};

export const resetPasswordIntoDB = async (token: string, password: string) => {
	const isValidToken = jwtHelpers.verifyJwtToken(token, "reset");
	if (!isValidToken) {
		throw new ApiError(httpStatus.FORBIDDEN, "Your reset token is not valid");
	}
	const userData = await prisma.user.findUniqueOrThrow({
		where: { id: isValidToken.decoded?.sub, status: UserStatus.ACTIVE },
	});
	const isSamePassword = await bcrypt.compare(password, userData.password);
	if (isSamePassword) {
		throw new ApiError(httpStatus.BAD_REQUEST, "You have already used this password once");
	}
	const hashed: string = await bcrypt.hash(password, 12);
	return await prisma.user.update({
		where: { id: isValidToken.decoded?.sub, status: UserStatus.ACTIVE },
		data: { password: hashed, needsPasswordChange: false },
	});
};

export const AuthServices = {
	loginUserFromDB,
	generateNewJwtToken,
	changePasswordIntoDB,
	sendResetPasswordEmail,
	resetPasswordIntoDB,
};
