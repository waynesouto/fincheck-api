import { FastifyRequest } from 'fastify'

import { IWrappedUseCase } from '@utils/use-case'
import { IResponse } from '@utils/response'
import { GenericRequest } from '@utils/fastify/types'

export type IApplyUseCaseOptions = {
	separateRequestData?: boolean
}

export const applyUseCase = <T = unknown, K = unknown>(
	useCase: () => IWrappedUseCase<T, K>,
	{ separateRequestData }: IApplyUseCaseOptions = {}
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

	return await useCase().handle(data as T)
}