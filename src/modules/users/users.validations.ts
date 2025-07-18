import { z } from "zod";
import { Gender, UserStatus } from "generated/prisma/index.js";

const adminSchema = z.object({
  name: z.string({ error: "Name is required." }),
  email: z.email({ error: "Email is required." }),
  contactNo: z.string({ error: "ContactNo is required." }),
  profilePhotoUrl: z.string().optional(),
});

const doctorSchema = z.object({
  name: z.string({ error: "Name is required." }),
  email: z.email({ error: "Email is required." }),
  contactNo: z.string({ error: "ContactNo is required." }),
  profilePhotoUrl: z.string().optional(),
  address: z.string().optional(),
  registrationNo: z.string({ error: "Registration Number is required." }),
  experienceInYears: z.number().int().positive().default(0),
  gender: z.enum(Gender),
  appointmentFee: z.number({ error: "Appointment Fee is required." }),
  qualification: z.string({ error: "Qualification is required." }),
  currentWorkingPlace: z.string({ error: "Current working place is required." }),
  designation: z.string({ error: "Designation is required." }),
});

const patientSchema = z.object({
  name: z.string({ error: "Name is required." }),
  email: z.email({ error: "Email is required." }),
  contactNo: z.string().optional(),
  profilePhotoUrl: z.string().optional(),
  address: z.string().optional(),
});


const createAdminRequestBodyValidation = z.object({
  password: z.string({ error: "Password is required" }),
  admin: adminSchema,
});

const createDoctorRequestBodyValidation = z.object({
  password: z.string({ error: "Password is required" }),
  doctor: doctorSchema,
});

const createPatientRequestBodyValidation = z.object({
  password: z.string({ error: "Password is required" }),
  patient: patientSchema,
});

const updateProfileRequestBodyValidation = adminSchema
  .extend(doctorSchema.shape)
  .extend(patientSchema.shape)
  .partial();


const changeUserStatusRequestValidation = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({ status: z.enum(UserStatus) }),
});

export const UsersValidations = {
  createAdminRequestBodyValidation,
  createDoctorRequestBodyValidation,
  createPatientRequestBodyValidation,
  changeUserStatusRequestValidation,
  updateProfileRequestBodyValidation,
};

