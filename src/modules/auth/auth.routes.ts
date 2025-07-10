import { UserRole } from "generated/prisma/index.js";
import authValidator from "@/middlewares/authValidator.js";
import { createRouter } from "@/shared/createRouter.js";
import { AuthControllers } from "./auth.controllers.js";

const router = createRouter();

router.post("/login", AuthControllers.LoginUser);
router.post("/refresh", AuthControllers.TokenRefresher);
router.post(
	"/change-password",
	authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
	AuthControllers.changePassword,
);
router.post("/forgot-password", AuthControllers.forgotPassword)

export const AuthRoutes = router;
