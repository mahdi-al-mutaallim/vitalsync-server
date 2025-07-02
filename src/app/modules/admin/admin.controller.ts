import catch_async from "@shared/catch-async";
import send_response from "@shared/send-response";
import httpStatus from "http-status";
import pick from "shared/pick";
import { admin_query_fields } from "./admin.constant";
import { AdminServices } from "./admin.service";

const getAdmins = catch_async(async (req, res) => {
	const filters = pick(req.query, admin_query_fields);
	const options = pick(req.query, ["limit", "page", "sort", "order"]);
	const result = await AdminServices.getAdmins(filters, options);
	if (result.data.length === 0) {
		send_response(res, {
			code: httpStatus.OK,
			status: "success",
			message: "No administrators found.",
			meta: result.meta,
			data: result.data,
		});
	}
	send_response(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrators retrieved successfully!",
		meta: result.meta,
		data: result.data,
	});
});

const getAdminById = catch_async(async (req, res) => {
	const { id } = req.params;
	const result = await AdminServices.getAdminById(id as string);
	send_response(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator retrieved successfully!",
		data: result,
	});
});

const updateAdminIntoDB = catch_async(async (req, res) => {
	const { id } = req.params;
	const result = await AdminServices.updateAdminIntoDB(id as string, req.body);
	send_response(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator updated successfully!",
		data: result,
	});
});

const deleteAdminFromDB = catch_async(async (req, res) => {
	const { id } = req.params;
	const result = await AdminServices.deleteAdminFromDB(id as string);
	send_response(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Administrator deleted successfully!",
		data: result,
	});
});

const softDeleteAdminFromDB = catch_async(async (req, res) => {
	const { id } = req.params;
	const result = await AdminServices.softDeleteFromDB(id as string);
	send_response(res, {
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
