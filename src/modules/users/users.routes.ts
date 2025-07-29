import { UserRole } from "generated/prisma/index.js";
import { fileUploader } from "@/helpers/fileUploader.js";
import accessValidator from "@/middlewares/accessValidator.js";
import tokenValidator from "@/middlewares/tokenValidator.js";
import validateRequest from "@/middlewares/validateRequest.js";
import { createRouter } from "@/shared/createRouter.js";
import { UserControllers } from "./users.controllers.js";
import { UsersValidations } from "./users.validators.js";

const router = createRouter();

router.get("/", tokenValidator(), accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN), UserControllers.getUsers);

router.get(
	"/me",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
	UserControllers.getMyProfile,
);

router.patch(
	"/me",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
	fileUploader.uploadToServer(),
	(req, res, next) => {
		req.body = UsersValidations.updateProfileRequestBodyValidation.parse(JSON.parse(req.body.data));
		return UserControllers.updateMyProfile(req, res, next);
	},
);

router.post(
	"/create-admin",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN),
	fileUploader.uploadToServer(),
	(req, res, next) => {
		req.body = UsersValidations.createAdminRequestBodyValidation.parse(JSON.parse(req.body.data));
		return UserControllers.createAdmin(req, res, next);
	},
);

router.post(
	"/create-doctor",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN),
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

router.patch(
	"/:id/:status",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN),
	validateRequest(UsersValidations.changeUserStatusRequestValidation),
	UserControllers.changeStatusById,
);

export const UserRoutes = router;
