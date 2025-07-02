import { admin_routes } from "@app/modules/admin/admin.routes";
import { auth_routes } from "@app/modules/auth/auth.routes";
import { user_routes } from "@app/modules/user/user.routes";
import { Router } from "express";

const router = Router();

type TRoute = { path: string; router: Router };

const module_routes: TRoute[] = [
	{ path: "/auth", router: auth_routes },
	{ path: "/users", router: user_routes },
	{ path: "/admins", router: admin_routes },
];

module_routes.forEach((route) => router.use(route.path, route.router));

export default router;
