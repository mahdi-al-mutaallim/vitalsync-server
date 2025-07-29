import z from "zod";

const createSpecialtyValidationSchema = z.object({
	body: z.object({
		// name: z.string().min(2).max(100),
		// email: z.email(),
	}),
});

const specialtyIdParamsValidationSchema = z.object({
	params: z.object({
		id: z.uuid(),
	}),
});

const updateSpecialtyByIdValidationSchema = z.object({
	params: z.object({
		id: z.uuid(),
	}),
	body: z.object({
		// name: z.string().min(2).max(100).optional(),
		// email: z.email().optional(),
	}),
});

export const SpecialtiesValidators = {
	createSpecialtyValidationSchema,
	specialtyIdParamsValidationSchema,
	updateSpecialtyByIdValidationSchema,
};
