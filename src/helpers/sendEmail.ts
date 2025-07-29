import { config } from "@/config/index.js";
import emailTransport from "@/shared/emailTransport.js";

const sendEmail = async (email: string, subject: string, template: string) => {
	return await emailTransport.sendMail({ from: config.smtpUser, to: email, subject, html: template });
};

export default sendEmail;
