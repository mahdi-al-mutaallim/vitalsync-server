import { prisma } from "@/shared/prisma.js";

const createPatientIntoDB = async () => {
	// Example: return await prisma.patient.create({ data: {...} });
};

const getPatientsFromDB = async () => {
	return await prisma.patient.findMany();
};

const getPatientByIdFromDB = async () => {
	// Example: return await prisma.patient.findUnique({ where: {...} });
};

const updatePatientByIdIntoDB = async () => {
	// Example: return await prisma.patient.update({ where: {...}, data: {...} });
};

const deletePatientByIdFromDB = async () => {
	// Example: return await prisma.patient.delete({ where: {...} });
};

export const PatientsServices = {
	createPatientIntoDB,
	getPatientsFromDB,
	getPatientByIdFromDB,
	updatePatientByIdIntoDB,
	deletePatientByIdFromDB,
};
