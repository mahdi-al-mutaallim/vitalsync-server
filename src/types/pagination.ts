export type SortOrder = "asc" | "desc";
type QueryOptionsObject = Record<"page" | "limit" | "skip" | "sort", number>;
type InputOptions = Omit<QueryOptionsObject, "skip">;
type InputOptionsToString = { [K in keyof InputOptions]: string };
type InputOptionsExtra = { order: SortOrder | (string & {}) };
export type PaginationOptions = Partial<
	InputOptionsToString & InputOptionsExtra
>;
export type PaginationOptionsResult = Omit<QueryOptionsObject, "sort"> & {
	sort: string;
	order: SortOrder;
};
