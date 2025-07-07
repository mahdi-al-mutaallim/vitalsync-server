import { createRouter } from "@/shared/createRouter.js";
import { userController } from "./user.controller.js";

const router = createRouter();

router.post("/", userController.createAdmin);

export const UserRoutes = router;
