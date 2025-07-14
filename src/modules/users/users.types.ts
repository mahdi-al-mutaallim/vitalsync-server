import type z from "zod";
import type { UsersValidations } from "./users.validations.js";

export type CreateAdmin = z.infer<typeof UsersValidations.createAdminRequestBodyValidation>;
export type CreateDoctor = z.infer<typeof UsersValidations.createDoctorRequestBodyValidation>;
export type CreatePatient = z.infer<typeof UsersValidations.createPatientRequestBodyValidation>;

export type UserQuery = Partial<Record<"search" | "email" | "role" | "status", string>>;
