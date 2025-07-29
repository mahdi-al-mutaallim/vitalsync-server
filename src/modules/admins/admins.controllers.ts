import ApiError from "@/errors/ApiError.js";
import catchAsync from "@/shared/catchAsync.js";
import httpStatus from "@/shared/httpStatus.js";
import pick from "@/shared/pick.js";
import sendResponse from "@/shared/sendResponse.js";
import { AdminQueryFields } from "./admins.constants.js";
import { AdminServices } from "./admins.services.js";

const getAdmins = catchAsync(async (req, res) => {
	const filters = pick(req.query, AdminQueryFields);
	const options = pick(req.query, ["limit", "page", "sort", "order"]);
	const result = await AdminServices.getAdminsFromDB(filters, options);
	if (result.data.length === 0) {
		throw new ApiError(httpStatus.NOT_FOUND, "No administrators found.");
	}
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrators retrieved successfully!",
		meta: result.meta,
		data: result.data,
	});
});

const getAdminById = catchAsync(async (req, res) => {
	const { id } = req.params as { id: string };
	const result = await AdminServices.getAdminByIdFromDB(id);
	if (!result) {
		throw new ApiError(httpStatus.NOT_FOUND, "Administrator not found");
	}
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator retrieved successfully!",
		data: result,
	});
});

const updateAdminById = catchAsync(async (req, res) => {
	const { id } = req.params as { id: string };
	const result = await AdminServices.updateAdminByIdIntoDB(id, req.body);
	if (!result) {
		throw new ApiError(httpStatus.NOT_FOUND, "Administrator not found");
	}
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator updated successfully!",
		data: result,
	});
});

const deleteAdminById = catchAsync(async (req, res) => {
	const { id } = req.params as { id: string };
	const result = await AdminServices.deleteAdminByIdFromDB(id);
	if (!result) {
		throw new ApiError(httpStatus.NOT_FOUND, "Administrator not found");
	}
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator deleted successfully!",
		data: result,
	});
});

const softDeleteAdminById = catchAsync(async (req, res) => {
	const { id } = req.params as { id: string };
	const result = await AdminServices.softDeleteAdminByIdFromDB(id);
	if (!result) {
		throw new ApiError(httpStatus.NOT_FOUND, "Administrator not found");
	}
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator removed successfully!",
		data: result,
	});
});

export const AdminControllers = {
	getAdmins,
	getAdminById,
	updateAdminById,
	deleteAdminById,
	softDeleteAdminById,
};
