import catchAsync from "@/shared/catchAsync.js";
import httpStatus from "@/shared/httpStatus.js";
import sendResponse from "@/shared/sendResponse.js";
import { AuthServices } from "./auth.services.js";
import ApiError from "@/errors/ApiError.js";

const LoginUser = catchAsync(async (req, res) => {
  const { refreshToken, accessToken, needsPasswordChange } = await AuthServices.loginUserFromDB(req.body);
  res.cookie("refreshToken", refreshToken, { secure: false, httpOnly: true });
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "User logged in successfully",
    data: { accessToken, needsPasswordChange },
  });
});

const TokenRefresher = catchAsync(async (req, res) => {
  const result = await AuthServices.getNewAccessTokenByRefreshToken(req.cookies.refreshToken);
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "Token refreshed successfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePasswordIntoDB(req.user, req.body)
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
    throw new ApiError(httpStatus.BAD_REQUEST, "Please provide an valid email address.")
  }
  const result = await AuthServices.checkIdentityAndReturnToken()
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to identify your account.");
  }
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "Resent link sent successfully, check you inbox.",
    data: null
  })

})

export const AuthControllers = {
  LoginUser,
  TokenRefresher,
  changePassword,
  forgotPassword
};
