import z from "zod";

const forgotRequestQueryValidationSchema = z.object({
	query: z.object({ email: z.email({ error: "Please provide a valid email address" }) }),
});

const passwordSchema = z
	.string()
	.trim()
	.min(8, { error: "Password must have minimum 8 characters." })
	.max(20, { error: "Password must be maximum 20 characters." })
	.refine((password) => /[A-Z]/.test(password), { error: "Password must have minimum 1 uppercase letter." })
	.refine((password) => /[a-z]/.test(password), { error: "Password must have minimum 1 lowercase letter." })
	.refine((password) => /[0-9]/.test(password), { error: "Password must include at least 1 number." })
	.refine((password) => /[!@#$%^&*]/.test(password), {
		error: "Password must have minimum 1 special character (!@#$%^&*).",
	})
	.refine((password) => !/\s/.test(password), { error: "Password cannot contain spaces." })
	.nonempty("Password cannot be empty.");

const resetRequestBodyValidationSchema = z.object({
	query: z.object({ token: z.string().nonempty("Token is required.") }),
	body: z.object({ password: passwordSchema }),
});

export const AuthValidators = {
	forgotRequestQueryValidationSchema,
	resetRequestBodyValidationSchema,
};
