import type { ErrorRequestHandler } from "express";
import httpStatus from "@/shared/httpStatus.js";

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
		status: "error",
		message: err.message || "Something went wrong!",
		error: err,
	});
};

export default globalErrorHandler;
