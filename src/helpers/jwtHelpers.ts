import * as jwt from "jsonwebtoken";

const generateToken = (
	payload: string | Buffer | object,
	secret: jwt.Secret | jwt.PrivateKey,
	expiresIn: jwt.SignOptions["expiresIn"],
) => {
	return jwt.sign(payload, secret, { algorithm: "HS256", expiresIn });
};

const verifyToken = (token: string, secret: jwt.Secret) => jwt.verify(token, secret);

export const jwtHelpers = { generateToken, verifyToken };
