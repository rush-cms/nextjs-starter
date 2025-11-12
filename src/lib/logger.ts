type LogLevel = 'info' | 'warn' | 'error'

interface LogData {
	[key: string]: unknown
}

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

function formatMessage(level: LogLevel, message: string, data?: LogData): string {
	const timestamp = new Date().toISOString()
	const prefix = `[${timestamp}] [${level.toUpperCase()}]`

	if (data && Object.keys(data).length > 0) {
		return `${prefix} ${message} ${JSON.stringify(data)}`
	}

	return `${prefix} ${message}`
}

export const logger = {
	info(message: string, data?: LogData): void {
		if (isDevelopment) {
			console.log(formatMessage('info', message, data))
		}
	},

	warn(message: string, data?: LogData): void {
		if (isDevelopment) {
			console.warn(formatMessage('warn', message, data))
		}
	},

	error(message: string, data?: LogData): void {
		if (isDevelopment) {
			console.error(formatMessage('error', message, data))
		} else if (isProduction) {
			console.error(formatMessage('error', message, { ...data, stack: undefined }))
		}
	}
}
