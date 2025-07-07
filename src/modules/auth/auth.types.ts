export type LoginPayload = {
	email: string;
	password: string;
};

export type AuthTokens = {
	accessToken: string;
	refreshToken: string;
	needsPasswordChange: boolean;
};

export type JwtUserPayload = {
	email: string;
	role: string;
};

export type NewAccessTokenResult = {
	accessToken: string;
	needsPasswordChange: boolean;
};
