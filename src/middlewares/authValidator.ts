import type { RequestHandler } from "express";
import { config } from "@/config/index.js";
import ApiError from "@/errors/ApiError.js";
import { jwtHelpers } from "@/helpers/jwtHelpers.js";
import type { JwtUserPayload } from "@/modules/auth/auth.types.js";
import httpStatus from "@/shared/httpStatus.js";

const authValidator = (...roles: string[]): RequestHandler => {
	return async (req, _res, next) => {
		try {
			const accessToken = req.headers.authorization;
			if (!accessToken) {
				throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
			}
			const decoded = jwtHelpers.verifyToken(accessToken, config.accessTokenSecret) as JwtUserPayload;
			if (roles.length && !roles.includes(decoded.role)) {
				throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
			}
			next();
		} catch (error) {
			next(error);
		}
	};
};

export default authValidator;
