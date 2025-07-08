import type { SignOptions } from "jsonwebtoken";
import * as z from "zod";

type ExpiresIn = SignOptions["expiresIn"]

// Convert empty or whitespace-only strings to undefined
const emptyStringCheck = (value: unknown) => (typeof value === "string" && value.trim() === "" ? undefined : value);

// Schema for valid expiresIn strings like '30m', '7d', etc.
const timeStringSchema = z.string().regex(/^\d+(ms|s|m|h|d|w|y)$/, {
	message: "Must be a valid time string like '15m', '7d', etc.",
});

// expiresIn schema accepts either valid string or positive integer number
const expiresInSchema = z.union([timeStringSchema, z.number().int().positive()]);

// Reusable schema builders for other fields omitted for brevity

const envSchema = z
	.object({
		port: z.preprocess(emptyStringCheck, z.coerce.number().int().positive().default(3000)),
		nodeEnv: z.preprocess(emptyStringCheck, z.enum(["development", "production", "test"]).default("development")),
		accessTokenSecret: z.preprocess(
			emptyStringCheck,
			z
				.string({ required_error: "ACCESS_TOKEN_SECRET is required" })
				.trim()
				.min(16, { message: "ACCESS_TOKEN_SECRET must be at least 16 characters" }),
		),
		refreshTokenSecret: z.preprocess(
			emptyStringCheck,
			z
				.string({ required_error: "REFRESH_TOKEN_SECRET is required" })
				.trim()
				.min(16, { message: "REFRESH_TOKEN_SECRET must be at least 16 characters" }),
		),
		accessTokenExpiresIn: z.preprocess(emptyStringCheck, expiresInSchema.default("30m")),
		refreshTokenExpiresIn: z.preprocess(emptyStringCheck, expiresInSchema.default("7d")),
	})
	.strict();

const rawEnv = {
	port: process.env.PORT,
	nodeEnv: process.env.NODE_ENV,
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
	accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
	refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
};

const env = envSchema.safeParse(rawEnv);

if (!env.success) {
	console.error("❌ Invalid environment variables:");
	console.error(JSON.stringify(env.error.format(), null, 2));
	process.exit(1);
}

// Define the final config type with expiresIn fields exactly matching jsonwebtoken's type
export type EnvConfig = Omit<z.infer<typeof envSchema>, "accessTokenExpiresIn" | "refreshTokenExpiresIn"> & {
	accessTokenExpiresIn: ExpiresIn;
	refreshTokenExpiresIn: ExpiresIn;
};

export const config: EnvConfig = env.data;
