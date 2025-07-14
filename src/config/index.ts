import type { SignOptions } from "jsonwebtoken";
import z from "zod";

// ✅ Extract only the string version of 'expiresIn'
type ExpiresIn = Exclude<SignOptions["expiresIn"], number | undefined>;

// ✅ Converts empty/whitespace-only strings to undefined
const emptyStringCheck = (val: unknown) => (typeof val === "string" && val.trim() === "" ? undefined : val);

// ✅ Utility to wrap any schema with empty string preprocessor
const withEmptyStringCheck = <T extends z.ZodTypeAny>(schema: T) => z.preprocess(emptyStringCheck, schema);

// ✅ Schema builder for required strings with field-aware error
const createRequiredString = (field: string, min = 1) =>
	withEmptyStringCheck(
		z
			.string({
				error: `${field} is required`,
			})
			.min(min, {
				message: `${field} must be at least ${min} character${min > 1 && "s"}`,
			}),
	);

// ✅ Schema builder for JWT expiresIn using SignOptions["expiresIn"]
const createExpiresIn = (field: string, defaultVal: ExpiresIn) =>
	withEmptyStringCheck(
		z
			.custom<ExpiresIn>((val): val is ExpiresIn => typeof val === "string" && /^\d+(ms|s|m|h|d|w|y)$/.test(val), {
				message: `${field} must be a valid time string like '15m', '7d', etc.`,
			})
			.default(defaultVal),
	);

// ✅ Env schema with all fields validated
export const envSchema = z
	.object({
		port: withEmptyStringCheck(z.coerce.number().int().positive().default(3000)),

		nodeEnv: withEmptyStringCheck(z.enum(["development", "production", "test"]).default("development")),

		accessTokenSecret: createRequiredString("ACCESS_TOKEN_SECRET", 16),
		refreshTokenSecret: createRequiredString("REFRESH_TOKEN_SECRET", 16),
		resetTokenSecret: createRequiredString("RESET_TOKEN_SECRET", 16),

		accessTokenExpiresIn: createExpiresIn("ACCESS_TOKEN_EXPIRES_IN", "30m"),
		refreshTokenExpiresIn: createExpiresIn("REFRESH_TOKEN_EXPIRES_IN", "7d"),
		resetTokenExpiresIn: createExpiresIn("RESET_TOKEN_EXPIRES_IN", "5m"),

		resetPasswordLinkPrefix: createRequiredString("RESET_PASS_LINK_PREFIX"),
		cloudinaryCloudName: createRequiredString("CLOUDINARY_CLOUD_NAME"),
		cloudinaryApiKey: createRequiredString("CLOUDINARY_API_KEY"),
		cloudinaryApiSecret: createRequiredString("CLOUDINARY_API_SECRET"),
	})
	.strict();

// ✅ Raw env vars from process.env
const rawEnv = {
	port: process.env.PORT,
	nodeEnv: process.env.NODE_ENV,
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
	resetTokenSecret: process.env.RESET_TOKEN_SECRET,
	accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
	refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
	resetTokenExpiresIn: process.env.RESET_TOKEN_EXPIRES_IN,
	resetPasswordLinkPrefix: process.env.RESET_PASS_LINK_PREFIX,
	cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
	cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
	cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};

// ✅ Parse and validate
const env = envSchema.safeParse(rawEnv);

if (!env.success) {
	console.error("❌ Invalid environment variables:");
	console.error(JSON.stringify(env.error.format(), null, 2));
	process.exit(1);
}

// ✅ Final config type
type EnvConfig = z.infer<typeof envSchema>;

export const config: EnvConfig = env.data;
