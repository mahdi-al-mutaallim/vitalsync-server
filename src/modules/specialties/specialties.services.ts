import { prisma } from "@/shared/prisma.js";

const createSpecialtyIntoDB = async () => {
	// Example: return await prisma.specialty.create({ data: {...} });
};

const getSpecialtiesFromDB = async () => {
	return await prisma.specialties.findMany();
};

const getSpecialtyByIdFromDB = async () => {
	// Example: return await prisma.specialty.findUnique({ where: {...} });
};

const updateSpecialtyByIdIntoDB = async () => {
	// Example: return await prisma.specialty.update({ where: {...}, data: {...} });
};

const deleteSpecialtyByIdFromDB = async () => {
	// Example: return await prisma.specialty.delete({ where: {...} });
};

export const SpecialtiesServices = {
	createSpecialtyIntoDB,
	getSpecialtiesFromDB,
	getSpecialtyByIdFromDB,
	updateSpecialtyByIdIntoDB,
	deleteSpecialtyByIdFromDB,
};
