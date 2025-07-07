class appError extends Error {
	public statusCode: number;
	public isOperational: boolean;

	constructor(statusCode: number, message?: string, isOperational = true, stack?: string) {
		// If message is undefined, super("") still works; fallback happens in handler
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export default appError;
