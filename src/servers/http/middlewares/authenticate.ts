import { FastifyReply, FastifyRequest } from 'fastify'

import { IFailedResponse } from '@utils/response'
import { UnauthorizedException } from '@utils/exception'
import { cookiesKeys } from '@utils/token'

export const authenticate = () => async(
	req: FastifyRequest,
	res: FastifyReply
): Promise<IFailedResponse | void> => {
	try {
		await req.jwtVerify({ onlyCookie: true })
	} catch {
		const { statusCode, ...result } = new UnauthorizedException()
		return res
			.clearCookie(cookiesKeys.ACCESS_TOKEN)
			.code(statusCode)
			.send(result)
	}
}