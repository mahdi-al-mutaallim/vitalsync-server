import { z } from "zod";

const createAdminRequestBodyValidation = z.object({
	password: z.string({
		required_error: "Password is required",
	}),
	admin: z.object({
		name: z.string(),
		email: z
			.string({
				required_error: "Email is required",
			})
			.email(),
		contactNo: z.string(),
	}),
});

export const UsersValidations = {
	createAdminRequestBodyValidation,
};
