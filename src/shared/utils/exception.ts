import { IFailedResponse, ProcessOptions } from '@utils/response'

export abstract class HttpException {
	process: ProcessOptions.FAILED = ProcessOptions.FAILED
	statusCode: number
	body: string

	constructor(response: Pick<IFailedResponse, 'statusCode' | 'body'>) {
		this.statusCode = response.statusCode
		this.body = response.body
	}
}

export class BadRequestException extends HttpException {
	constructor(message: string) {
		super({ body: message, statusCode: 400 })
	}
}

export class UnauthorizedException extends HttpException {
	constructor(message = 'Unauthorized') {
		super({ body: message, statusCode: 401 })
	}
}

export class ForbiddenException extends HttpException {
	constructor() {
		super({ body: 'Access to this resource is blocked', statusCode: 403 })
	}
}

export class NotFoundException extends HttpException {
	constructor(message: string) {
		super({ body: message, statusCode: 404 })
	}
}

export class ConflictException extends HttpException {
	constructor(message: string) {
		super({ body: message, statusCode: 409 })
	}
}

export class FailedDependencyException extends HttpException {
	constructor(message: string) {
		super({ body: message, statusCode: 424 })
	}
}

export class ServerErrorException extends HttpException {
	constructor(message: string) {
		super({ body: message, statusCode: 500 })
	}
}

export const isHttpException = (arg: object): arg is HttpException => {
	return arg && 'process' in arg && 'body' in arg && 'statusCode' in arg
}