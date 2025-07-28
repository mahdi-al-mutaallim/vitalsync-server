import { prisma } from "@/shared/prisma.js";

const createDoctorIntoDB = async () => {
  // Example: return await prisma.doctor.create({ data: {...} });
};

const getDoctorsFromDB = async () => {
  return await prisma.doctor.findMany();
};

const getDoctorByIdFromDB = async () => {
  // Example: return await prisma.doctor.findUnique({ where: {...} });
};

const updateDoctorByIdIntoDB = async () => {
  // Example: return await prisma.doctor.update({ where: {...}, data: {...} });
};

const deleteDoctorByIdFromDB = async () => {
  // Example: return await prisma.doctor.delete({ where: {...} });
};

export const DoctorsServices = {
  createDoctorIntoDB,
  getDoctorsFromDB,
  getDoctorByIdFromDB,
  updateDoctorByIdIntoDB,
  deleteDoctorByIdFromDB,
};
