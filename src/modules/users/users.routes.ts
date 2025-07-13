import { UserRole } from "generated/prisma/index.js";
import { fileUploader } from "@/helpers/fileUploader.js";
import authValidator from "@/middlewares/authValidator.js";
// import validateRequest from "@/middlewares/validateRequest.js";
import { createRouter } from "@/shared/createRouter.js";
import { UserControllers } from "./users.controllers.js";
import { UsersValidations } from "./users.validations.js";

// import { UsersValidations } from "./users.validations.js";

const router = createRouter();

router.post("/", authValidator(UserRole.SUPER_ADMIN), fileUploader.uploadToServer(), (req, res, next) => {
	req.body = UsersValidations.createAdminRequestBodyValidation.parse(JSON.parse(req.body.data));
	return UserControllers.createAdmin(req, res, next);
});

export const UserRoutes = router;
