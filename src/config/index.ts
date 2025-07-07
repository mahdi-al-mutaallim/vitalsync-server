import { z } from "zod";

const expiresInSchema = z.preprocess(
	(val) => (val === "" || val === undefined ? undefined : val),
	z.string().regex(/^\d+(ms|s|m|h|d|w|y)$/, {
		message: "Must be a valid time string like '15m', '7d', etc.",
	}),
);

const envSchema = z.object({
	port: z
		.string()
		.default("3000")
		.transform((val) => parseInt(val, 10))
		.pipe(z.number().int().positive()),
	nodeEnv: z.enum(["development", "production", "test"]).default("development"),
	databaseUrl: z.string().min(1, "DATABASE_URL is required"),
	accessTokenSecret: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
	accessTokenExpiresIn: expiresInSchema.default("30m"),
	refreshTokenSecret: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
	refreshTokenExpiresIn: expiresInSchema.default("7d"),
});

const rawEnv = {
	port: process.env.PORT,
	nodeEnv: process.env.NODE_ENV,
	databaseUrl: process.env.DATABASE_URL,
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
	accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
	refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
};

const env = envSchema.safeParse(rawEnv);

if (!env.success) {
	console.error("❌ Invalid environment variables:", env.error.format());
	process.exit(1);
}

export const config = env.data;
