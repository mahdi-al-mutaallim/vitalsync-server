import { UserRole } from "generated/prisma/index.js";
import { fileUploader } from "@/helpers/fileUploader.js";
import authValidator from "@/middlewares/authValidator.js";
import { createRouter } from "@/shared/createRouter.js";
import { UserControllers } from "./users.controllers.js";
import { UsersValidations } from "./users.validations.js";
import validateRequest from "@/middlewares/validateRequest.js";

const router = createRouter();

router.get("/", authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN), UserControllers.getUsers);

router.get("/me", authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), UserControllers.getMyProfile)

router.post("/create-admin", authValidator(UserRole.SUPER_ADMIN), fileUploader.uploadToServer(), (req, res, next) => {
  req.body = UsersValidations.createAdminRequestBodyValidation.parse(JSON.parse(req.body.data));
  return UserControllers.createAdmin(req, res, next);
});

router.post(
  "/create-doctor",
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.uploadToServer(),
  (req, res, next) => {
    req.body = UsersValidations.createDoctorRequestBodyValidation.parse(JSON.parse(req.body.data));
    return UserControllers.createDoctor(req, res, next);
  },
);

router.post("/create-patient", fileUploader.uploadToServer(), (req, res, next) => {
  req.body = UsersValidations.createPatientRequestBodyValidation.parse(JSON.parse(req.body.data));
  return UserControllers.createPatient(req, res, next);
});

router.patch("/:id/status", authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(UsersValidations.changeUserStatusRequestValidation), UserControllers.changeStatusById)

export const UserRoutes = router;
