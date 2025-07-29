import type { ErrorRequestHandler } from "express";
import ApiError from "@/errors/ApiError.js";
import httpStatus from "@/shared/httpStatus.js";

// Optional helper to fallback cleanly
const fallbackMessage = (msg: string | undefined, fallback: string) => (!msg || msg.trim() === "" ? fallback : msg);

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
	let message = "Something went wrong!";

	if (err instanceof ApiError) {
		statusCode = err.statusCode;
		message = fallbackMessage(err.message, "Something went wrong!");
	} else if (err.code === "P2002") {
		statusCode = httpStatus.CONFLICT;
		message = "Duplicate entry found";
	} else if (err.code === "P2025") {
		statusCode = httpStatus.NOT_FOUND;

		// always override Prisma's ugly message here
		message = fallbackMessage(err.message, "Record not found");
	} else if (err.code?.startsWith("P")) {
		statusCode = httpStatus.BAD_REQUEST;
		message = "Database operation failed";
	} else if (err.name === "ZodError") {
		statusCode = httpStatus.BAD_REQUEST;
		message = "Validation failed";
	} else if (err.statusCode) {
		statusCode = err.statusCode;
		message = fallbackMessage(err.message, "Something went wrong!");
	} else if (err.message) {
		message = fallbackMessage(err.message, "Something went wrong!");
	} else {
		message = "Something went wrong!";
	}

	// Build response
	const errorResponse: {
		success: boolean;
		status: number;
		message: string;
		stack?: string;
	} = {
		success: false,
		status: statusCode,
		message,
	};

	// Include stack only in development
	if (process.env.NODE_ENV === "development" && err.stack) {
		errorResponse.stack = err.stack;
	}

	res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;
