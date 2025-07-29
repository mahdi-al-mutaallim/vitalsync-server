import { UserRole } from "generated/prisma/index.js";
import accessValidator from "@/middlewares/accessValidator.js";
import tokenValidator from "@/middlewares/tokenValidator.js";
import validateRequest from "@/middlewares/validateRequest.js";
import { createRouter } from "@/shared/createRouter.js";
import { DoctorsControllers } from "./doctors.controllers.js";
import { DoctorsValidators } from "./doctors.validators.js";

const router = createRouter();

router.get("/", DoctorsControllers.getDoctors);
router.get("/:id", DoctorsControllers.getDoctorById);
router.patch(
	"/:id",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.DOCTOR),
	validateRequest(DoctorsValidators.updateDoctorByIdValidationSchema),
	DoctorsControllers.updateDoctorById,
);
router.delete(
	"/:id",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN),
	DoctorsControllers.deleteDoctorById,
);
router.patch(
	":id/delete",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN),
	DoctorsControllers.softDeleteDoctorById,
);

export const DoctorsRoutes = router;
