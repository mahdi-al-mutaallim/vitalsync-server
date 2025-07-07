import type {
	PaginationOptions,
	PaginationOptionsResult,
} from "@/types/pagination.js";

const isProperSortOption = (value: unknown): value is string =>
	typeof value === "string" && value.trim() !== "";

const isValidOrder = (value: unknown): value is "asc" | "desc" =>
	value === "asc" || value === "desc";

const calculatePagination = (
	options: PaginationOptions,
): PaginationOptionsResult => {
	const page = Math.max(1, parseInt(options.page || "1", 10) || 1);
	const limit = Math.max(1, parseInt(options.limit || "10", 10) || 10);
	const skip = (page - 1) * limit;

	const hasValidSort = isProperSortOption(options.sort);
	const rawOrder = options.order?.toLowerCase();
	const hasValidOrder = isValidOrder(rawOrder);

	const sort =
		hasValidSort && hasValidOrder
			? (options.sort as string).trim()
			: "createdAt";
	const order = hasValidSort && hasValidOrder ? rawOrder : "desc";

	return { page, limit, skip, sort, order };
};

export const paginationHelper = { calculatePagination };
