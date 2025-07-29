import type { RequestHandler } from "express";
import type { ZodObject } from "zod";

const validateRequest = (schema: ZodObject): RequestHandler => {
	return async (req, _res, next) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (error) {
			next(error);
		}
	};
};

export default validateRequest;
