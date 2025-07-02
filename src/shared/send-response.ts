import type { Response } from "express";

const send_response = <T>(
	res: Response,
	data: {
		code: number;
		status: string;
		message: string;
		meta?: {
			page: number;
			limit: number;
			total: number;
		};
		data: T | null | undefined;
	},
) => {
	res.status(data.code).json({
		status: data.status,
		message: data.message,
		meta: data.meta || null || undefined,
		data: data.data || null || undefined,
	});
};

export default send_response;
