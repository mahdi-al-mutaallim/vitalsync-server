type TOptions = {
	page?: string;
	limit?: string;
	sort?: string;
	order?: string;
};

type TOptionsResult = {
	page: number;
	limit: number;
	sort: string;
	order: "asc" | "desc";
	skip: number;
};

const isProperSortOption = (value: unknown): value is string =>
	typeof value === "string" && value.trim() !== "";

const isValidOrder = (value: unknown): value is "asc" | "desc" =>
	value === "asc" || value === "desc";

const calculate_pagination = (options: TOptions): TOptionsResult => {
	const page = Math.max(1, parseInt(options.page || "1", 10) || 1);
	const limit = Math.max(1, parseInt(options.limit || "10", 10) || 10);
	const skip = (page - 1) * limit;

	const hasValidSort = isProperSortOption(options.sort);
	const rawOrder = options.order?.toLowerCase();
	const hasValidOrder = isValidOrder(rawOrder);

	const sort =
		hasValidSort && hasValidOrder ? options.sort!.trim() : "createdAt";
	const order =
		hasValidSort && hasValidOrder ? (rawOrder as "asc" | "desc") : "desc";

	return { page, limit, skip, sort, order };
};

export const pagination_helper = {
	calculate_pagination,
};
