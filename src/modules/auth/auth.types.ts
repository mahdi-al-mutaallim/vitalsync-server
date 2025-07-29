export type LoginPayload = {
	email: string;
	password: string;
};

export type ChangePassword = {
	oldPassword: string;
	newPassword: string;
};
