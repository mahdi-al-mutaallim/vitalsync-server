import z from "zod";

const createDoctorValidationSchema = z.object({
  body: z.object({
    // name: z.string().min(2).max(100),
    // email: z.email(),
  }),
});

const doctorIdParamsValidationSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

const updateDoctorByIdValidationSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    // name: z.string().min(2).max(100).optional(),
    // email: z.email().optional(),
  }),
});

export const DoctorsValidators = {
  createDoctorValidationSchema,
  doctorIdParamsValidationSchema,
  updateDoctorByIdValidationSchema,
};
