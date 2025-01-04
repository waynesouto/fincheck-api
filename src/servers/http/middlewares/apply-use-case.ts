import { FastifyRequest } from 'fastify'

import { IWrappedUseCase } from '@utils/use-case'
import { responseLogger } from '@utils/logger'
import { IResponse } from '@utils/response'
import { GenericRequest } from '@utils/fastify/types'

export interface IApplyUseCaseOptions {
	separateRequestData?: boolean
	logResponse?:
		| { validator: (status: number) => boolean }
		| true
}

export const applyUseCase = <T = unknown, K = unknown>(
	useCase: () => IWrappedUseCase<T, K>,
	{ separateRequestData, logResponse }: IApplyUseCaseOptions = {}
) => async(
	req: FastifyRequest<GenericRequest>
): Promise<IResponse<K>> => {
	let data = { ...req.query, ...req.body }
	if (typeof req.user === 'object' && req.user !== null && 'userId' in req.user) {
		data.userId = req.user.userId
	}

	if (separateRequestData) {
		const { userId, ...body } = data
		data = {
			userId,
			data: body
		}
	}

	data = { ...data, ...req.params }

	const result = await useCase().handle(data as T)

	if (
		logResponse !== undefined &&
		(typeof logResponse === 'boolean' || logResponse.validator(result.statusCode))
	) {
		responseLogger({
			...result,
			route: req.originalUrl
		})
	}

	return result
}