export enum ProcessOptions {
	SUCCESS = 'success',
	FAILED = 'failed'
}

type ISuccessResponse<T> = {
	body: T
	process: ProcessOptions.SUCCESS
	statusCode: number
}

export type IFailedResponse = {
	body: string
	process: ProcessOptions.FAILED
	statusCode: number
}

export type IResponse<T> = ISuccessResponse<T> | IFailedResponse

export class SuccessResponse<T> {
	process: ProcessOptions.SUCCESS = ProcessOptions.SUCCESS
	statusCode: number = 200
	body: T

	constructor(data: T) {
		this.body = data
	}
}