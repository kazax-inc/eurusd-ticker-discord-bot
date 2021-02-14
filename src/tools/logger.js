import { createLogger, format, transports } from 'winston';

const { combine, printf, colorize } = format;
const colorizer = colorize();
const LEVEL = Symbol.for('level');

const filterOnly = (level) => format((info) => (info[LEVEL] === level ? info : undefined))();

const myFormatInfo = printf(({ message, timestamp }) => `${timestamp} | info  | ${message}`);

const myFormatWarn = printf(({ level, message, timestamp }) =>
	colorizer.colorize(level, `${timestamp} | warn  | ${message}`)
);

const myFormatError = printf(({ level, file, method, message, data, timestamp }) => {
	if (message instanceof Error) {
		const text = `${timestamp} | error | ${file} | ${method} | ${message.name} | ${
			message.message
		}${data ? ` | ${JSON.stringify(data)}` : ''}`;
		return colorizer.colorize(level, text);
	}
	return colorizer.colorize(
		level,
		`${timestamp} | error | ${file} | ${method} | ${
			typeof message === 'string' ? message : JSON.stringify(message)
		}`
	);
});

const { timestamp } = format;

const logger = createLogger({
	transports: [
		new transports.Console({
			level: 'info',
			format: combine(filterOnly('info'), timestamp(), myFormatInfo)
		}),
		new transports.Console({
			level: 'warn',
			format: combine(filterOnly('warn'), timestamp(), myFormatWarn)
		}),
		new transports.Console({
			level: 'error',
			format: combine(filterOnly('error'), timestamp(), myFormatError)
		})
	]
});

export default logger;
