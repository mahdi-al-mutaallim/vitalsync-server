import nodemailer from "nodemailer";

export const sendEmail = async (email: string, subject: string, template: string) => {
	// Create a test account or replace with real credentials.
	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: "ernestina.schroeder20@ethereal.email",
			pass: "gBDBnk8UUtWHYxmK1n",
		},
	});
	const info = await transporter.sendMail({
		from: '"VitalSync" <ernestina.schroeder20@ethereal.email>',
		to: email,
		subject,
		html: template,
	});

	console.log("Message sent:", info.messageId);
	return info;
};
