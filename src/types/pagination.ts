// "asc" | "desc" is clear already
export type SortDirection = "asc" | "desc";

// The core query options with numbers
type QueryParams = Record<"page" | "limit" | "skip" | "sort", number>;

// Input params without `skip`
type InputQueryParams = Omit<QueryParams, "skip">;

// Stringified version of InputQueryParams
type StringifiedInputQueryParams = { [K in keyof InputQueryParams]: string };

// Adds sort direction explicitly
type SortOptions = { order: SortDirection | (string & {}) };

// The options the user can pass for pagination, strings & optional
export type PaginationQueryOptions = Partial<StringifiedInputQueryParams & SortOptions>;

// The fully-resolved pagination result with proper types
export type ResolvedPaginationOptions = Omit<QueryParams, "sort"> & {
	sort: string;
	order: SortDirection;
};
