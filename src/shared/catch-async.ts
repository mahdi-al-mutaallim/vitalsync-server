import type { RequestHandler } from "express";

/**
 * Wraps an Express route handler (sync or async) and ensures
 * that any errors are properly passed to `next()`.
 *
 * This prevents unhandled promise rejections and
 * avoids try/catch in every controller.
 *
 * ✅ Supports both synchronous and asynchronous handlers.
 * ✅ Shorter and uses built-in RequestHandler type.
 */
const catch_async = (fn: RequestHandler): RequestHandler => {
	return (req, res, next) => {
		// Ensures even sync exceptions are turned into Promise rejections
		return Promise.resolve(fn(req, res, next)).catch(next);
	};
};

export default catch_async;
