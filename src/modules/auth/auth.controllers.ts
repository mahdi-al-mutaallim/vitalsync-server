import ApiError from "@/errors/ApiError.js";
import catchAsync from "@/shared/catchAsync.js";
import httpStatus from "@/shared/httpStatus.js";
import sendResponse from "@/shared/sendResponse.js";
import { AuthServices } from "./auth.services.js";
import { clearCookies, setCookies } from "./auth.utils.js";

const loginUser = catchAsync(async (req, res) => {
	const { refreshToken, accessToken, needsPasswordChange } = await AuthServices.loginUserFromDB(req.body);
	setCookies(res, accessToken, refreshToken);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "User logged in successfully",
		data: { needsPasswordChange },
	});
});

const logoutUser = catchAsync(async (_req, res) => {
	clearCookies(res);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "User logged out successfully",
	});
});

const tokenRefresher = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
	}
	const { refreshToken, accessToken } = await AuthServices.generateNewJwtToken(req.user);
	setCookies(res, accessToken, refreshToken);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Token refreshed successfully!",
	});
});

const changePassword = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
	}
	const result = await AuthServices.changePasswordIntoDB(req.user, req.body);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Password changed successfully!",
		data: result,
	});
});

const forgotPassword = catchAsync(async (req, res) => {
	const { email } = req.query as { email: string };
	const result = await AuthServices.sendResetPasswordEmail(email);
	if (!result) {
		throw new ApiError(httpStatus.BAD_REQUEST, "No account found with this email.");
	}
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Password reset link has been sent.",
		data: result,
	});
});

const resetPassword = catchAsync(async (req, res) => {
	const { token } = req.query as { token: string };
	const { password } = req.body as { password: string };
	const result = await AuthServices.resetPasswordIntoDB(token, password);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Your password has been reset successfully.",
		data: result,
	});
});

export const AuthControllers = {
	loginUser,
	logoutUser,
	tokenRefresher,
	changePassword,
	forgotPassword,
	resetPassword,
};
