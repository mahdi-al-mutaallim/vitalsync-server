import httpStatus from "http-status";
import catch_async from "@/shared/catchAsync.js";
import send_response from "@/shared/sendResponse.js";
import { auth_services } from "./auth.service.js";

const login_user = catch_async(async (req, res) => {
	const result = await auth_services.login_user(req.body);
	res.cookie("refreshToken", result.refresh_token, {
		secure: false,
		httpOnly: true,
	});
	send_response(res, {
		code: httpStatus.OK,
		status: "success",
		message: "User logged in successfully",
		data: {
			access_token: result.access_token,
			needs_password_change: result.needs_password_changed,
		},
	});
});

const token_refresher = catch_async(async (req, res) => {
	const result = await auth_services.token_refresher(req.cookies.refreshToken);
	send_response(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Token refreshed successfully!",
		data: result,
	});
});

export const auth_controllers = {
	login_user,
	token_refresher,
};
