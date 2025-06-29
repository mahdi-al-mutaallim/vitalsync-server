import { type Prisma, PrismaClient } from "@generated/prisma";

const prisma = new PrismaClient();

const getAdmins = async (params: any) => {
	const { search, ...filters } = params;
	const AndConditions: Prisma.AdminWhereInput[] = [];
	const admin_search_fields = ["name", "email"];
	if (Object.keys(filters).length > 0) {
    AndConditions.push({
      AND: Object.keys(filters).map((key) => ({
        [key]: {
          equals: filters[key],
				},
			})),
		});
	}
	if (search) {
    AndConditions.push({
      OR: admin_search_fields.map((field) => ({
        [field]: {
          contains: search,
					mode: "insensitive",
				},
			})),
		});
	}
  console.dir(AndConditions, {depth: Infinity})
	const WhereConditions = { AND: AndConditions };
	const result = await prisma.admin.findMany({
		where: WhereConditions,
	});
	return result;
};

export const AdminServices = {
	getAdmins,
};
