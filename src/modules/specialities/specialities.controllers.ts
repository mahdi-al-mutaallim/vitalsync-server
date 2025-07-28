import catchAsync from "@/shared/catchAsync.js";

const createSpecialitie = catchAsync(async (req, res) => {
  console.log(req, res);
});

const getSpecialities = catchAsync(async (req, res) => {
  console.log(req, res);
});

const getSpecialitieById = catchAsync(async (req, res) => {
  console.log(req, res);
});

const updateSpecialitieById = catchAsync(async (req, res) => {
  console.log(req, res);
});

const deleteSpecialitieById = catchAsync(async (req, res) => {
  console.log(req, res);
});

export const SpecialitiesControllers = {
  createSpecialitie,
  getSpecialities,
  getSpecialitieById,
  updateSpecialitieById,
  deleteSpecialitieById,
};
