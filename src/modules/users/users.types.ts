import type z from "zod";
import type { UsersValidations } from "./users.validations.js";

export type CreateAdminRequest = z.infer<typeof UsersValidations.createAdminRequestBodyValidation>;
export type CreateAdminBody = CreateAdminRequest["body"];
export type CreateAdminInfo = CreateAdminBody["admin"];
