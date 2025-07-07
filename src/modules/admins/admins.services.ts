import { paginationHelper } from "@/helpers/paginationHelper.js";
import type { Admin, Prisma } from "@/shared/prisma.js";
import { prisma, UserStatus } from "@/shared/prisma.js";
import type { PaginationQueryOptions } from "@/types/pagination.js";
import { AdminSearchFields } from "./admins.constants.js";
import type { TAdminQuery } from "./admins.types.js";

const getAdminsFromDB = async (query: TAdminQuery, options: PaginationQueryOptions) => {
	const { search, ...filters } = query;
	const { limit, skip, sort, order, page } = paginationHelper.calculatePagination(options);
	const AndConditions: Prisma.AdminWhereInput[] = [];
	if (search) {
		AndConditions.push({
			OR: AdminSearchFields.map((field) => ({ [field]: { contains: search, mode: "insensitive" } })),
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
		orderBy: { [sort]: order },
	});
	const total = await prisma.admin.count({ where: WhereConditions });
	return { meta: { page, limit, total }, data: result };
};

const getAdminByIdFromDB = async (id: string): Promise<Admin | null> => {
	return await prisma.admin.findUnique({ where: { id, isDeleted: false } });
};

const updateAdminByIdIntoDB = async (id: string, data: Partial<Admin>): Promise<Admin> => {
	return await prisma.admin.update({ where: { id, isDeleted: false }, data });
};

const deleteAdminByIdFromDB = async (id: string): Promise<Admin> => {
	return await prisma.$transaction(async (tsx) => {
		const deletedAdmin = await tsx.admin.delete({ where: { id } });
		await tsx.user.delete({ where: { email: deletedAdmin.email } });
		return deletedAdmin;
	});
};
const softDeleteAdminByIdFromDB = async (id: string): Promise<Admin> => {
	return await prisma.$transaction(async (tsx) => {
		const updateAdmin = await tsx.admin.update({
			where: { id, isDeleted: false },
			data: { isDeleted: true },
		});
		await tsx.user.update({ where: { email: updateAdmin.email }, data: { status: UserStatus.DELETED } });
		return updateAdmin;
	});
};

export const AdminServices = {
	getAdminsFromDB,
	getAdminByIdFromDB,
	updateAdminByIdIntoDB,
	deleteAdminByIdFromDB,
	softDeleteAdminByIdFromDB,
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
