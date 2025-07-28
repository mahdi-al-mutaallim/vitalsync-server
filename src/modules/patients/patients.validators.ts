import z from "zod";

const createPatientValidationSchema = z.object({
  body: z.object({
    // name: z.string().min(2).max(100),
    // email: z.email(),
  }),
});

const patientIdParamsValidationSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

const updatePatientByIdValidationSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    // name: z.string().min(2).max(100).optional(),
    // email: z.email().optional(),
  }),
});

export const PatientsValidators = {
  createPatientValidationSchema,
  patientIdParamsValidationSchema,
  updatePatientByIdValidationSchema,
};
