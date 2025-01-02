import { ProcessOptions } from '@utils/response'

// Logger to register messages or route responses
type IResponseLogger<T> = {
	route: string
	process: ProcessOptions
	status_code: number
	body: T | string
}

export const responseLogger = <T>(message: IResponseLogger<T>) => {
	// Log result of operations in use-cases
	const { route, process, status_code, body } = message
	let logMessage = `[fincheck] Route: ${route} result was "${process}" with status code ${status_code}.`
	if (process === 'failed') {
		logMessage += ` The failed reason was ${body?.toString()}.`
	}
	const timestamp = new Date().toISOString()
	logMessage += ` At ${timestamp}`
	console.log(logMessage)
}