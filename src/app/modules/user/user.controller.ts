import catch_async from "@shared/catch-async";
import send_response from "@shared/send-response";
import httpStatus from "http-status";
import { userService } from "./user.service";

const createAdmin = catch_async(async (req, res) => {
	const result = await userService.createAdmin(req.body);
	send_response(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Admin created successfully!",
		data: result,
	});
});

export const userController = {
	createAdmin,
};
