import ApiError from "@/errors/ApiError.js";
import catchAsync from "@/shared/catchAsync.js";
import httpStatus from "@/shared/httpStatus.js";
import pick from "@/shared/pick.js";
import sendResponse from "@/shared/sendResponse.js";
import { UserQueryFields } from "./user.constants.js";
import { UserServices } from "./users.services.js";
import { UserStatus } from "generated/prisma/index.js";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdmin(req.file, req.body);
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "Admin created successfully!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req, res) => {
  const result = await UserServices.createDoctor(req.file, req.body);
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "Doctor created successfully!",
    data: result,
  });
});

const createPatient = catchAsync(async (req, res) => {
  const result = await UserServices.createPatient(req.file, req.body);
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "Patient created successfully!",
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, UserQueryFields);
  const options = pick(req.query, ["limit", "page", "sort", "order"]);
  const result = await UserServices.getUsersFromDB(filters, options);
  if (result.data.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found.");
  }
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "Users retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const changeStatusById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  if (typeof id !== "string") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please provide an valid id");
  }
  if (!Object.values(UserStatus).includes(status as UserStatus)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please provide an valid status");
  }
  const result = await UserServices.changeStatusByIdFromDB(id, status as UserStatus);
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "Status changed successfully.",
    data: result
  })
})

const getMyProfile = catchAsync(async (req, res) => {
  const data = await UserServices.getUserByIdFromDB(req.user.id as string)
  sendResponse(res, {
    code: httpStatus.OK,
    status: "success",
    message: "User profile fetched successfully.",
    data
  })
})

export const UserControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getUsers,
  changeStatusById,
  getMyProfile
};
