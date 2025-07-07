import type { RequestHandler } from "express";
import type { AnyZodObject } from "zod";

const validateRequest = (schema: AnyZodObject): RequestHandler => {
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
