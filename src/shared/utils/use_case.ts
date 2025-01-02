import { IResponse, ProcessOptions, SuccessResponse } from '@utils/response'
import { isHttpException, ServerErrorException } from '@utils/exception'
import { responseLogger } from '@utils/logger'

/**
 * Represents a generic use case interface.
 * @template T - The input data type.
 * @template K - The output data type.
 */
export interface IUseCase<T, K> {
	/**
     * Validates the input data for the use case and returns a corresponding T.
     * @param data - The input data.
     * @returns A promise that resolves to a response of type K.
     */
	validate?(data: T): Promise<T>

	/**
     * Executes the use case by processing the input data and returning a response.
     * @param data - The input data.
     * @returns A promise that resolves to a response of type K.
     */
	execute(data: T): Promise<K>
}

/**
 * Represents a wrapped use case that
 *
 * @template T - The type of data that the use case handles.
 * @template K - The type of response that the use case returns.
 */
export interface IWrappedUseCase<T, K> {
	handle(data: T): Promise<IResponse<K>>
}

/**
 * Represents a handler for executing use cases.
 * @template T The input data type for the use case.
 * @template K The output data type for the use case.
 */
export class UseCaseHandler<T, K> implements IWrappedUseCase<T, K> {
	constructor(private useCase: IUseCase<T, K>) {}

	/**
     * Handles the internal calls of the use case.
     * @param data The input data for the use case.
     * @returns A promise that resolves to the response from the use case execution.
     */
	async handle(data: T): Promise<IResponse<K>> {
		try {
			const validated = this.useCase.validate !== undefined
				? await this.useCase.validate(data)
				: data
			const result = await this.useCase.execute(validated)

			return new SuccessResponse(result)
		} catch (error) {
			if (isHttpException(error)) {
				return error
			}
			responseLogger({
				body: error.message,
				process: ProcessOptions.FAILED,
				route: this.useCase.constructor.name,
				status_code: 500
			})
			return new ServerErrorException(error.message)
		}
	}
}
