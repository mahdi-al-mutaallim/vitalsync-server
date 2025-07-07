import { z } from "zod";

const envSchema = z.object({
	port: z.string().default("3000").transform((val) => parseInt(val, 10)).pipe(z.number().int().positive()),
	nodeEnv: z.enum(["development", "production", "test"]).default("development"),
	databaseUrl: z.string().min(1, "DATABASE_URL is required"),
	accessTokenSecret: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
  accessTokenExpiresIn: z.string().min(1, "ACCESS_TOKEN_EXPIRES_IN is required"),
	refreshTokenSecret: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  refreshTokenExpiresIn: z.string().min(1, "REFRESH_TOKEN_EXPIRES_IN is required")
});

const rawEnv = {
	port: process.env.PORT,
	nodeEnv: process.env.NODE_ENV,
	databaseUrl: process.env.DATABASE_URL,
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
};

const _env = envSchema.safeParse(rawEnv);

if (!_env.success) {
	console.error("❌ Invalid environment variables:", _env.error.format());
	process.exit(1);
}

export const env = _env.data;
