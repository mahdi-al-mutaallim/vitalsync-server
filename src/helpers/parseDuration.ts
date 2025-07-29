const parseDuration = (duration: string | undefined): number => {
	if (!duration) {
		throw new Error(`Duration is required but got: ${duration}`);
	}

	const regex = /^(\d+)\s*(ms|s|m|h|d)$/i;
	const match = duration.match(regex);

	if (!match) {
		throw new Error(`Invalid duration format: ${duration}`);
	}

	const [, numStr, unit] = match;

	if (!numStr || !unit) {
		throw new Error(`Invalid duration format: ${duration}`);
	}

	const value = Number.parseInt(numStr, 10);

	const multipliers: Record<string, number> = {
		ms: 1,
		s: 1000,
		m: 60 * 1000,
		h: 60 * 60 * 1000,
		d: 24 * 60 * 60 * 1000,
	};

	const factor = multipliers[unit.toLowerCase()];
	if (!factor) {
		throw new Error(`Unsupported time unit: ${unit}`);
	}

	return value * factor;
};

export default parseDuration;
