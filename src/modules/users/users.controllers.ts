import { fileUploader } from "@/helpers/fileUploader.js";
import catchAsync from "@/shared/catchAsync.js";
import httpStatus from "@/shared/httpStatus.js";
import sendResponse from "@/shared/sendResponse.js";
import { UserServices } from "./users.services.js";

const createAdmin = catchAsync(async (req, res) => {
	const file = req.file;
	if (file) {
		const result = await fileUploader.uploadToCloudinary(file);
		req.body.admin.profilePhoto = result.secure_url;
		console.log(req.body);
	}
	const result = await UserServices.createAdmin(req.body);
	sendResponse(res, {
		code: httpStatus.OK,
		status: "success",
		message: "Admin created successfully!",
		data: result,
	});
});

export const UserControllers = {
	createAdmin,
};
