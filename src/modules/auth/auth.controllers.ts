import catch_async from "@/shared/catchAsync.js";
import httpStatus from "@/shared/httpStatus.js";
import sendResponse from "@/shared/sendResponse.js";
import { AuthServices } from "./auth.services.js";

const LoginUser = catch_async(async (req, res) => {
	const { refreshToken, accessToken, needsPasswordChange } = await AuthServices.loginUserFromDB(req.body);
	res.cookie("refreshToken", refreshToken, { secure: false, httpOnly: true });
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "User logged in successfully",
		data: { accessToken, needsPasswordChange },
	});
});

const TokenRefresher = catch_async(async (req, res) => {
	const result = await AuthServices.getNewAccessTokenByRefreshToken(req.cookies.refreshToken);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Token refreshed successfully!",
		data: result,
	});
});

export const AuthControllers = {
	LoginUser,
	TokenRefresher,
};
