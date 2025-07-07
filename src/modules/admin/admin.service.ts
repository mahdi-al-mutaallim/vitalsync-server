import { paginationHelper } from "@/helpers/paginationHelper.js";
import type { Admin, Prisma } from "@/shared/prisma.js";
import { prisma, UserStatus } from "@/shared/prisma.js";
import type { PaginationOptions } from "@/types/pagination.js";
import { AdminSearchFields } from "./admin.constant.js";
import type { TAdminQuery } from "./admin.types.js";

const getAdmins = async (query: TAdminQuery, options: PaginationOptions) => {
	const { search, ...filters } = query;
	const { limit, skip, sort, order, page } =
		paginationHelper.calculatePagination(options);
	const AndConditions: Prisma.AdminWhereInput[] = [];
	if (search) {
		AndConditions.push({
			OR: AdminSearchFields.map((field) => ({
				[field]: {
					contains: search,
					mode: "insensitive",
				},
			})),
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
	AndConditions.push({ isDeleted: false });
	const WhereConditions = { AND: AndConditions };
	// console.dir(WhereConditions, {depth: Infinity})
	const result = await prisma.admin.findMany({
		where: WhereConditions,
		skip,
		take: limit,
		orderBy: {
			[sort]: order,
		},
	});
	const total = await prisma.admin.count({
		where: WhereConditions,
	});
	return {
		meta: {
			page,
			limit,
			total,
		},
		data: result,
	};
};

const getAdminById = async (id: string): Promise<Admin | null> => {
	return await prisma.admin.findUnique({ where: { id, isDeleted: false } });
};

const updateAdminIntoDB = async (
	id: string,
	data: Partial<Admin>,
): Promise<Admin> => {
	return await prisma.admin.update({ where: { id, isDeleted: false }, data });
};

const deleteAdminFromDB = async (id: string): Promise<Admin> => {
	return await prisma.$transaction(async (tsx) => {
		const deletedAdmin = await tsx.admin.delete({ where: { id } });
		await tsx.user.delete({ where: { email: deletedAdmin.email } });
		return deletedAdmin;
	});
};
const softDeleteFromDB = async (id: string): Promise<Admin> => {
	return await prisma.$transaction(async (tsx) => {
		const updateAdmin = await tsx.admin.update({
			where: { id, isDeleted: false },
			data: { isDeleted: true },
		});
		await tsx.user.update({
			where: { email: updateAdmin.email },
			data: { status: UserStatus.DELETED },
		});
		return updateAdmin;
	});
};

export const AdminServices = {
	getAdmins,
	getAdminById,
	updateAdminIntoDB,
	deleteAdminFromDB,
	softDeleteFromDB,
};

/*
for example:
data: 1 2 3 4 5 6 7 8
page = 2
limit = 3

skip = 3
formula = (page - 1) * limit
        = (2 - 1) * 3
        = 1 * 3
        = 3
*/
