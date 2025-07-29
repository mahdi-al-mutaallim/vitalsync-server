import type { RequestHandler } from "express";
import type { UserRole } from "generated/prisma/index.js";
import ApiError from "@/errors/ApiError.js";
import httpStatus from "@/shared/httpStatus.js";

const accessValidator = (...roles: UserRole[]): RequestHandler => {
	return async (req, _res, next) => {
		try {
			if (!req.user) {
				throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authenticated!");
			}
			if (roles.length && !roles.includes(req.user.role)) {
				throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission.");
			}
			next();
		} catch (error) {
			next(error);
		}
	};
};

export default accessValidator;
