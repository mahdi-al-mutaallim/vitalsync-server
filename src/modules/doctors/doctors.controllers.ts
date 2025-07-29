import catchAsync from "@/shared/catchAsync.js";

const createDoctor = catchAsync(async (req, res) => {
	console.log(req, res);
});

const getDoctors = catchAsync(async (req, res) => {
	console.log(req, res);
});

const getDoctorById = catchAsync(async (req, res) => {
	console.log(req, res);
});

const updateDoctorById = catchAsync(async (req, res) => {
	console.log(req, res);
});

const deleteDoctorById = catchAsync(async (req, res) => {
	console.log(req, res);
});

const softDeleteDoctorById = catchAsync(async (req, res) => {
	console.log(req, res);
});

export const DoctorsControllers = {
	createDoctor,
	getDoctors,
	getDoctorById,
	updateDoctorById,
	deleteDoctorById,
	softDeleteDoctorById,
};
