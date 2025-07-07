import { z } from "zod";

const createAdminRequestBodyValidation = z.object({
	body: z.object({
		password: z.string(),
		admin: z.object({
			name: z.string(),
			email: z.string().email(),
			contactNo: z.string(),
		}),
	}),
});

export const UsersValidations = {
	createAdminRequestBodyValidation,
};
