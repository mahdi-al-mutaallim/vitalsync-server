import type { UserRole, UserStatus } from "generated/prisma/index.js";
import type z from "zod";
import type { UsersValidations } from "./users.validations.js";

export type CreateAdmin = z.infer<typeof UsersValidations.createAdminRequestBodyValidation>;
export type CreateDoctor = z.infer<typeof UsersValidations.createDoctorRequestBodyValidation>;
export type CreatePatient = z.infer<typeof UsersValidations.createPatientRequestBodyValidation>;

export type UserQuery = Partial<Record<"search" | "email" | "role" | "status", string>>;

export type UserProfile = {
	id: string;
	email: string;
	role: UserRole;
	needsPasswordChange: boolean;
	status: UserStatus;
	name: string;
	profilePhotoUrl: string | null;
	contactNo: string | null;
};
export type ProfileDetails = Pick<UserProfile, "name" | "profilePhotoUrl" | "contactNo">;
