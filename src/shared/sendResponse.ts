import type { Response } from "express";

const sendResponse = <T>(
	res: Response,
	data: {
		code: number;
		status: string;
		message: string;
		meta?: {
			page: number;
			limit: number;
			total: number;
		} | null;
		data?: T | null;
	},
) => {
	res.status(data.code).json({
		status: data.status,
		message: data.message,
		meta: data.meta || null,
		data: data.data || null,
	});
};

export default sendResponse;
