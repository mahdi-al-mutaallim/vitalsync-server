import ApiError from "@/errors/ApiError.js";
import catchAsync from "@/shared/catchAsync.js";
import httpStatus from "@/shared/httpStatus.js";
import sendResponse from "@/shared/sendResponse.js";
import { AuthServices } from "./auth.services.js";

const loginUser = catchAsync(async (req, res) => {
  const { refreshToken, accessToken, needsPasswordChange } = await AuthServices.loginUserFromDB(req.body);
  res.cookie("refreshToken", refreshToken, { secure: false, httpOnly: true });
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "User logged in successfully",
    data: { accessToken, needsPasswordChange },
  });
});

const tokenRefresher = catchAsync(async (req, res) => {
  const result = await AuthServices.getNewAccessTokenByRefreshToken(req.cookies.refreshToken);
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "Token refreshed successfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePasswordIntoDB(req.user, req.body);
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "Password changed successfully!",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please provide an valid email address.");
  }
  const result = await AuthServices.sendResetPasswordEmail(email);
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to identify your account.");
  }
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "Password reset link sent successfully.",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;
  if (typeof token !== "string") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Your reset password token is required.");
  }
  if (!password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "New password is required to reset your password.");
  }

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
  tokenRefresher,
  changePassword,
  forgotPassword,
  resetPassword,
};
