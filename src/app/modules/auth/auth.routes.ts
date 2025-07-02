import { Router } from "express";
import { auth_controllers } from "./auth.controller";

const router = Router();

router.post("/login", auth_controllers.login_user);
router.post("/refresh", auth_controllers.token_refresher);

export const auth_routes = router;
