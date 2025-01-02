import { FastifyRequest } from 'fastify'

import { IWrappedUseCase } from '@utils/use_case'
import { responseLogger } from '@utils/logger'
import { IResponse } from '@utils/response'
import { GenericRequest } from '@utils/fastify/types'

export interface IApplyUseCaseOptions {
	separate_request_data?: boolean
	log_response?:
		| { validator: (status: number) => boolean }
		| true
}

export const applyUseCase = <T = unknown, K = unknown>(
	useCase: () => IWrappedUseCase<T, K>,
	{ separate_request_data, log_response }: IApplyUseCaseOptions = {}
) => async(
	req: FastifyRequest<GenericRequest>
): Promise<IResponse<K>> => {
	let data = { ...req.query, ...req.body }
	if (typeof req.user === 'object' && req.user !== null && 'user_id' in req.user) {
		data.user_id = req.user.user_id
	}

	if (separate_request_data) {
		const { user_id, ...body } = data
		data = {
			user_id,
			data: body
		}
	}

	data = { ...data, ...req.params }

	const result = await useCase().handle(data as T)

	if (
		log_response !== undefined &&
        (typeof log_response === 'boolean' || log_response.validator(result.status_code))
	) {
		responseLogger({
			route: req.originalUrl,
			process: result.process,
			body: result.body,
			status_code: result.status_code
		})
	}

	return result
}