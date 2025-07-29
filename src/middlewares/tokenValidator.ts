import type { RequestHandler } from "express";
import ApiError from "@/errors/ApiError.js";
import { jwtHelpers } from "@/helpers/jwtHelpers.js";
import httpStatus from "@/shared/httpStatus.js";

const tokenValidator = (mode: "access" | "refresh" = "access"): RequestHandler => {
	return async (req, _res, next) => {
		try {
			const token = mode === "access" ? req.signedCookies.access_token : req.signedCookies.refresh_token;
			if (!token) {
				throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
			}
			const result = jwtHelpers.verifyJwtToken(token, mode);
			if (!result.success) {
				throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
			}
			req.user = result.decoded;
			next();
		} catch (error) {
			next(error);
		}
	};
};

export default tokenValidator;
