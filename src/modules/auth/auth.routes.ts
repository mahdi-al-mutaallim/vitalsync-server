import { UserRole } from "generated/prisma/index.js";
import accessValidator from "@/middlewares/accessValidator.js";
import tokenValidator from "@/middlewares/tokenValidator.js";
import validateRequest from "@/middlewares/validateRequest.js";
import { createRouter } from "@/shared/createRouter.js";
import { AuthControllers } from "./auth.controllers.js";
import { AuthValidators } from "./auth.validators.js";

const router = createRouter();

router.post("/login", AuthControllers.loginUser);
router.get("/logout", AuthControllers.logoutUser);
router.post(
	"/refresh",
	tokenValidator("refresh"),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
	AuthControllers.tokenRefresher,
);
router.post(
	"/change",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
	AuthControllers.changePassword,
);
router.post(
	"/forgot",
	validateRequest(AuthValidators.forgotRequestQueryValidationSchema),
	AuthControllers.forgotPassword,
);
router.post("/reset", validateRequest(AuthValidators.resetRequestBodyValidationSchema), AuthControllers.resetPassword);

export const AuthRoutes = router;
