import { z } from "zod";

const UserIdParamsRequestValidationSchema = z.object({ params: z.object({ id: z.uuid() }) });

const updateAdminByIdRequestValidationSchema = z.object({
	params: z.object({ id: z.uuid() }),
	body: z.object({ name: z.string().optional(), contactNo: z.string().optional() }),
});

export const AdminValidations = {
	UserIdParamsRequestValidationSchema,
	updateAdminByIdRequestValidationSchema,
};
