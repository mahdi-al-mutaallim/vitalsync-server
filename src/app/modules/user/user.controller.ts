import type { RequestHandler } from "express";
import { userService } from "./user.service.js";

const createAdmin: RequestHandler = async (req, res) => {
	try {
		const result = await userService.createAdmin(req.body);
		res.status(200).json({
			status: "success",
			message: "Admin created successfully!",
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: error?.name || "Something went wrong",
			error,
		});
	}
};

export const userController = {
	createAdmin,
};
