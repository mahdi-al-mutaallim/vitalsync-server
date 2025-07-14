import bcrypt from "bcrypt";
import { fileUploader } from "@/helpers/fileUploader.js";
import { paginationHelper } from "@/helpers/paginationHelper.js";
import { type Prisma, prisma, UserRole } from "@/shared/prisma.js";
import type { PaginationQueryOptions } from "@/types/pagination.js";
import { UserSearchFields } from "./user.constants.js";
import type { CreateAdmin, CreateDoctor, CreatePatient, UserQuery } from "./users.types.js";

const createAdmin = async (file: Express.Multer.File | undefined, payload: CreateAdmin) => {
	if (file) {
		const result = await fileUploader.uploadToCloudinary(file);
		payload.admin.profilePhotoUrl = result.secure_url;
	}
	const hashedPassword: string = await bcrypt.hash(payload.password, 12);
	const newUser = { email: payload.admin.email, password: hashedPassword, role: UserRole.ADMIN };
	return await prisma.$transaction(async (tsx) => {
		await tsx.user.create({ data: newUser });
		return await tsx.admin.create({ data: payload.admin });
	});
};

const createDoctor = async (file: Express.Multer.File | undefined, payload: CreateDoctor) => {
	if (file) {
		const result = await fileUploader.uploadToCloudinary(file);
		payload.doctor.profilePhotoUrl = result.secure_url;
	}
	const hashedPassword: string = await bcrypt.hash(payload.password, 12);
	const newUser = { email: payload.doctor.email, password: hashedPassword, role: UserRole.DOCTOR };
	return await prisma.$transaction(async (tsx) => {
		await tsx.user.create({ data: newUser });
		return await tsx.doctor.create({ data: payload.doctor });
	});
};

const createPatient = async (file: Express.Multer.File | undefined, payload: CreatePatient) => {
	if (file) {
		const result = await fileUploader.uploadToCloudinary(file);
		payload.patient.profilePhotoUrl = result.secure_url;
	}
	const hashedPassword: string = await bcrypt.hash(payload.password, 12);
	const newUser = { email: payload.patient.email, password: hashedPassword, role: UserRole.PATIENT };
	return await prisma.$transaction(async (tsx) => {
		await tsx.user.create({ data: newUser });
		return await tsx.patient.create({ data: payload.patient });
	});
};

const getUsersFromDB = async (query: UserQuery, options: PaginationQueryOptions) => {
	const { search, ...filters } = query;
	const { limit, skip, sort, order, page } = paginationHelper.calculatePagination(options);
	const AndConditions: Prisma.UserWhereInput[] = [];
	if (search) {
		AndConditions.push({
			OR: UserSearchFields.map((field) => ({ [field]: { contains: search, mode: "insensitive" } })),
		});
	}
	if (Object.keys(filters).length > 0) {
		AndConditions.push({
			AND: (Object.keys(filters) as (keyof typeof filters)[]).map((key) => ({
				[key]: {
					equals: filters[key],
				},
			})),
		});
	}
	const WhereConditions = { AND: AndConditions };
	const result = await prisma.user.findMany({
		where: WhereConditions,
		skip,
		take: limit,
		orderBy: { [sort]: order },
	});
	const total = await prisma.user.count({ where: WhereConditions });
	return { meta: { page, limit, total }, data: result };
};

export const UserServices = {
	createAdmin,
	createDoctor,
	createPatient,
	getUsersFromDB,
};
