import z from "zod";

const createSpecialitieValidationSchema = z.object({
  body: z.object({
    // name: z.string().min(2).max(100),
    // email: z.email(),
  }),
});

const specialitieIdParamsValidationSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

const updateSpecialitieByIdValidationSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    // name: z.string().min(2).max(100).optional(),
    // email: z.email().optional(),
  }),
});

export const SpecialitiesValidators = {
  createSpecialitieValidationSchema,
  specialitieIdParamsValidationSchema,
  updateSpecialitieByIdValidationSchema,
};
