import chalk from "chalk";
import type { RequestHandler } from "express";

const getDhakaTime = (): string => {
	const now = new Date();
	return `[${now.toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" })}-${now.toLocaleTimeString("en-GB", { timeZone: "Asia/Dhaka", hour12: true })}]`;
};

const logger: RequestHandler = (req, res, next) => {
	const start = process.hrtime.bigint();
	res.on("finish", () => {
		const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
		const method = chalk.cyan.bold(req.method);
		const url = chalk.green(`${req.protocol}://${req.headers.host}${req.baseUrl}${req.url}`);
		const status = res.statusCode < 400 ? chalk.green(res.statusCode) : chalk.red(res.statusCode);
		const time = chalk.yellow(`${durationMs.toFixed(2)} ms`);
		const agent = chalk.magenta(req.headers["user-agent"] || "");
		const timestamp = chalk.blue(getDhakaTime());

		console.log(
			`${timestamp} ${method} ${url} ${chalk.gray(`HTTP/${req.httpVersion}`)} ${status} ${time} ${chalk.gray("-")} ${agent}`,
		);
	});
	next();
};

export default logger;
