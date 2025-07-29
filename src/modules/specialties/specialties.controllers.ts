import catchAsync from "@/shared/catchAsync.js";

const createSpecialty = catchAsync(async (req, res) => {
	console.log(req, res);
});

const getSpecialties = catchAsync(async (req, res) => {
	console.log(req, res);
});

const getSpecialtyById = catchAsync(async (req, res) => {
	console.log(req, res);
});

const updateSpecialtyById = catchAsync(async (req, res) => {
	console.log(req, res);
});

const deleteSpecialtyById = catchAsync(async (req, res) => {
	console.log(req, res);
});

export const SpecialtiesControllers = {
	createSpecialty,
	getSpecialties,
	getSpecialtyById,
	updateSpecialtyById,
	deleteSpecialtyById,
};
