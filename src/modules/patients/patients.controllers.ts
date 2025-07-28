import catchAsync from "@/shared/catchAsync.js";

const createPatient = catchAsync(async (req, res) => {
  console.log(req, res);
});

const getPatients = catchAsync(async (req, res) => {
  console.log(req, res);
});

const getPatientById = catchAsync(async (req, res) => {
  console.log(req, res);
});

const updatePatientById = catchAsync(async (req, res) => {
  console.log(req, res);
});

const deletePatientById = catchAsync(async (req, res) => {
  console.log(req, res);
});

export const PatientsControllers = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
};
