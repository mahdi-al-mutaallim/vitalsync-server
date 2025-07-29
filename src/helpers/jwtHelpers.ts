import jwt from "jsonwebtoken";
import { config } from "@/config/index.js";
import type { JwtTokenPayload, JwtTokenType } from "@/types/jwt.js";
import extractErrorMessage from "./extractErrorMessage.js";

const generateJwtToken = (payload: JwtTokenPayload) => {
	const secret = payload.type === "access" ? config.accessTokenSecret : config.refreshTokenSecret;
	const expiresIn = payload.type === "access" ? config.accessTokenExpiresIn : config.refreshTokenExpiresIn;
	return jwt.sign(payload, secret, { expiresIn });
};

const verifyJwtToken = (token: string, tokenType: JwtTokenType) => {
	const secret =
		tokenType === "access"
			? config.accessTokenSecret
			: tokenType === "refresh"
				? config.refreshTokenSecret
				: config.resetTokenSecret;
	try {
		const decoded = jwt.verify(token, secret) as JwtTokenPayload;
		return { success: true, decoded };
	} catch (error) {
		return { success: false, error: extractErrorMessage(error) };
	}
};

export const jwtHelpers = { generateJwtToken, verifyJwtToken };
