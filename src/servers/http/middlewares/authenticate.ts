import { FastifyReply, FastifyRequest } from 'fastify'

import { IFailedResponse } from '@utils/response'
import { UnauthorizedException } from '@utils/exception'
import { env } from '@utils/env'

export const authenticate = () => async(
	request: FastifyRequest,
	reply: FastifyReply
): Promise<IFailedResponse | void> => {
	try {
		await request.jwtVerify({ onlyCookie: true })
	} catch {
		const tokenSufix = env.NODE_ENV === 'production' ? '' : '-homolog'
		const { status_code, ...result } = new UnauthorizedException()
		return reply
			.clearCookie(`@fincheck:access-token${tokenSufix}`)
			.code(status_code)
			.send(result)
	}
}