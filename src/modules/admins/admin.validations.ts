import { z } from "zod";

const updateRequestBodyValidation = z.object({
	body: z.object({
		name: z.string().optional(),
		contactNo: z.string().optional(),
	}),
});

export const AdminValidations = {
	updateRequestBodyValidation,
};
