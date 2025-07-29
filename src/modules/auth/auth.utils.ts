import type { CookieOptions, Response } from "express";
import { config } from "@/config/index.js";
import parseDuration from "@/helpers/parseDuration.js";

const cookieConfig: CookieOptions = {
	...(config.nodeEnv === "production" ? { domain: config.clientDomain } : {}),
	httpOnly: true,
	path: "/",
	secure: config.nodeEnv === "production",
	sameSite: "lax",
	signed: true,
};

/**
 * Clears authentication cookies from the response.
 * @param res - Express Response object
 */
export const clearCookies = (res: Response) => {
	res.clearCookie("access_token", cookieConfig);
	res.clearCookie("refresh_token", cookieConfig);
};

/**
 * Sets authentication cookies (access and refresh tokens) on the response.
 * Clears any existing cookies before setting new ones.
 * @param res - Express Response object
 * @param accessToken - JWT access token string
 * @param refreshToken - JWT refresh token string
 */
export const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
	const accessTokenMaxAge = parseDuration(config.accessTokenExpiresIn);
	const refreshTokenMaxAge = parseDuration(config.refreshTokenExpiresIn);

	clearCookies(res);

	res.cookie("access_token", accessToken, { ...cookieConfig, maxAge: accessTokenMaxAge });
	res.cookie("refresh_token", refreshToken, { ...cookieConfig, maxAge: refreshTokenMaxAge });
};
