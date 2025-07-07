import type { RequestHandler } from "express";
import httpStatus from "@/shared/httpStatus.js";

const notFound: RequestHandler = (req, res, _next) => {
	res.status(httpStatus.NOT_FOUND).json({
		status: "error",
		message: "API Route not found",
		error: {
			path: req.originalUrl,
			message: "Your requested path does not exists",
		},
	});
};

export default notFound;
