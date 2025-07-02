import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const not_found = (req: Request, res: Response, _next: NextFunction) => {
	res.status(httpStatus.NOT_FOUND).json({
		status: "error",
		message: "API Route not found",
		error: {
			path: req.originalUrl,
			message: "Your requested path does not exists",
		},
	});
};

export default not_found;
