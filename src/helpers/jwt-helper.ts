import jwt from "jsonwebtoken";

const generate_token = (
	payload: string | Buffer | object,
	secret: jwt.Secret | jwt.PrivateKey,
	expiresIn: jwt.SignOptions["expiresIn"],
) => {
	return jwt.sign(payload, secret, { algorithm: "HS256", expiresIn });
};

const verify_token = (token: string, secret: jwt.Secret) => {
	return jwt.verify(token, secret);
};

export const jwt_helpers = {
	generate_token,
	verify_token,
};
