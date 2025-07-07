import httpStatus from "http-status";
import catchAsync from "@/shared/catchAsync.js";
import pick from "@/shared/pick.js";
import sendResponse from "@/shared/sendResponse.js";
import { AdminQueryFields } from "./admin.constant.js";
import { AdminServices } from "./admin.service.js";

const getAdmins = catchAsync(async (req, res) => {
	const filters = pick(req.query, AdminQueryFields);
	const options = pick(req.query, ["limit", "page", "sort", "order"]);
	const result = await AdminServices.getAdmins(filters, options);
	if (result.data.length === 0) {
		sendResponse(res, {
			code: httpStatus.OK,
			status: "success",
			message: "No administrators found.",
			meta: result.meta,
			data: result.data,
		});
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
	const { id } = req.params;
	const result = await AdminServices.getAdminById(id as string);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator retrieved successfully!",
		data: result,
	});
});

const updateAdminIntoDB = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result = await AdminServices.updateAdminIntoDB(id as string, req.body);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator updated successfully!",
		data: result,
	});
});

const deleteAdminFromDB = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result = await AdminServices.deleteAdminFromDB(id as string);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator deleted successfully!",
		data: result,
	});
});

const softDeleteAdminFromDB = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result = await AdminServices.softDeleteFromDB(id as string);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator deleted successfully!",
		data: result,
	});
});

export const AdminControllers = {
	getAdmins,
	getAdminById,
	updateAdminIntoDB,
	deleteAdminFromDB,
	softDeleteAdminFromDB,
};
