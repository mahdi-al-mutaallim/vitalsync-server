import { z } from "zod";

const admin_update = z.object({
	body: z.object({
		name: z.string().optional(),
		contactNo: z.string().optional(),
	}),
});

export const admin_validation_schemas = {
	admin_update,
};
