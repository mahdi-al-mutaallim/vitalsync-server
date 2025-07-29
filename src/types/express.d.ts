import type { JwtTokenPayload } from "./jwt.ts";

declare global {
	namespace Express {
		interface Request {
			user?: JwtTokenPayload;
		}
	}
}
