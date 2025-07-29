import type { UserRole } from "generated/prisma/index.js";
import type { JwtPayload } from "jsonwebtoken";

export type JwtTokenType = "access" | "refresh" | "reset";

export type JwtTokenPayload = JwtPayload & {
	type: JwtTokenType;
	role: UserRole;
};
