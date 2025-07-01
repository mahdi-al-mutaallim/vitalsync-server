import { type Prisma, PrismaClient } from "@generated/prisma";
import { admin_search_fields } from "./admin.constant";

const prisma = new PrismaClient();


const calculate_pagination = (options: { page?: number, limit?: number, sort?: string, order?: string }) => {
  const page: number = Number(options.limit) && Number(options.page) ? Number(options.page) : 1;
  const limit: number = Number(options.limit) && Number(options.page) ? Number(options.limit) : 10;
  const skip: number = (page - 1) * limit;
  const sort = options.sort && options.order ? options.sort : 'createdAt';
  const order = options.sort && options.order ? options.order : 'desc'
  return { page, limit, skip, sort, order }
}

const getAdmins = async (params: any, options: any) => {
  const { search, ...filters } = params;
  const { page, limit, skip, sort, order } = calculate_pagination(options)
  const AndConditions: Prisma.AdminWhereInput[] = [];
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
  if (Object.keys(filters).length > 0) {
    AndConditions.push({
      AND: Object.keys(filters).map((key) => ({
        [key]: {
          equals: filters[key],
        },
      })),
    });
  }
  const WhereConditions = { AND: AndConditions };
  const result = await prisma.admin.findMany({
    where: WhereConditions,
    skip,
    take: limit,
    orderBy: {
      [sort]: order
    }
  });
  return result;
};

export const AdminServices = {
  getAdmins,
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
