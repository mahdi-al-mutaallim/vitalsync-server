import { prisma } from "@/shared/prisma.js";

const createSpecialitieIntoDB = async () => {
  // Example: return await prisma.specialitie.create({ data: {...} });
};

const getSpecialitiesFromDB = async () => {
  return await prisma.specialitie.findMany();
};

const getSpecialitieByIdFromDB = async () => {
  // Example: return await prisma.specialitie.findUnique({ where: {...} });
};

const updateSpecialitieByIdIntoDB = async () => {
  // Example: return await prisma.specialitie.update({ where: {...}, data: {...} });
};

const deleteSpecialitieByIdFromDB = async () => {
  // Example: return await prisma.specialitie.delete({ where: {...} });
};

export const SpecialitiesServices = {
  createSpecialitieIntoDB,
  getSpecialitiesFromDB,
  getSpecialitieByIdFromDB,
  updateSpecialitieByIdIntoDB,
  deleteSpecialitieByIdFromDB,
};
