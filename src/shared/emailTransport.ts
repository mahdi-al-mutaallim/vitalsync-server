import nodemailer from "nodemailer";
import { config } from "@/config/index.js";

const emailTransport = nodemailer.createTransport({
	service: "gmail",
	auth: { user: config.smtpUser, pass: config.smtpPass },
});

export default emailTransport;
