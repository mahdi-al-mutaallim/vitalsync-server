import bcrypt from "bcryptjs";
import type { Doctor, Patient } from "generated/prisma/index.js";
import ApiError from "@/errors/ApiError.js";
import { fileUploader } from "@/helpers/fileUploader.js";
import { paginationHelper } from "@/helpers/paginationHelper.js";
import httpStatus from "@/shared/httpStatus.js";
import { type Admin, type Prisma, prisma, UserRole, UserStatus } from "@/shared/prisma.js";
import type { PaginationQueryOptions } from "@/types/pagination.js";
import { UserSearchFields } from "./user.constants.js";
import type {
	CreateAdmin,
	CreateDoctor,
	CreatePatient,
	ProfileDetails,
	UpdateProfile,
	UserProfile,
	UserQuery,
} from "./users.types.js";

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
		omit: { password: true },
		include: { admin: true, doctor: true, patient: true },
	});
	const total = await prisma.user.count({ where: WhereConditions });
	return { meta: { page, limit, total }, data: result };
};

const getUserByIdFromDB = async (id: string): Promise<UserProfile> => {
	const userDetails = await prisma.user.findUniqueOrThrow({
		where: { id, status: UserStatus.ACTIVE },
		omit: { password: true, createdAt: true, updatedAt: true },
	});

	let profileDetails: ProfileDetails = {
		name: "",
		contactNo: "",
		profilePhotoUrl: "",
	};

	switch (userDetails.role) {
		case UserRole.SUPERADMIN:
		case UserRole.ADMIN:
			profileDetails = await prisma.admin.findUniqueOrThrow({
				where: { email: userDetails.email },
				select: { name: true, profilePhotoUrl: true, contactNo: true },
			});
			break;

		case UserRole.DOCTOR:
			profileDetails = await prisma.doctor.findUniqueOrThrow({
				where: { email: userDetails.email },
				select: { name: true, profilePhotoUrl: true, contactNo: true },
			});
			break;

		case UserRole.PATIENT:
			profileDetails = await prisma.patient.findUniqueOrThrow({
				where: { email: userDetails.email },
				select: { name: true, profilePhotoUrl: true, contactNo: true },
			});
			break;

		default:
			throw new Error(`Unhandled role: ${userDetails.role}`);
	}

	return {
		...userDetails,
		...profileDetails,
	};
};

const changeStatusByIdFromDB = async (id: string, status: UserStatus) => {
	const userData = await prisma.user.findUniqueOrThrow({ where: { id } });
	if (userData.status === status) {
		throw new ApiError(httpStatus.CONFLICT, `User status is already '${status}`);
	}
	return await prisma.user.update({ where: { id }, data: { status } });
};

const updateMyProfileIntoDB = async (id: string, file: Express.Multer.File | undefined, payload: UpdateProfile) => {
	if (file) {
		const result = await fileUploader.uploadToCloudinary(file);
		payload.profilePhotoUrl = result.secure_url;
	}
	const userData = await prisma.user.findUniqueOrThrow({
		where: { id, status: UserStatus.ACTIVE },
	});

	let updatedData: Admin | Patient | Doctor;

	switch (userData.role) {
		case UserRole.SUPERADMIN:
		case UserRole.ADMIN:
			updatedData = await prisma.admin.update({ where: { id }, data: payload });
			break;

		case UserRole.DOCTOR:
			updatedData = await prisma.doctor.update({ where: { id }, data: payload });
			break;

		case UserRole.PATIENT:
			updatedData = await prisma.patient.update({ where: { id }, data: payload });
			break;

		default:
			throw new Error(`Unhandled role: ${userData.role}`);
	}
	return updatedData;
};

export const UserServices = {
	createAdmin,
	createDoctor,
	createPatient,
	getUsersFromDB,
	changeStatusByIdFromDB,
	getUserByIdFromDB,
	updateMyProfileIntoDB,
};
