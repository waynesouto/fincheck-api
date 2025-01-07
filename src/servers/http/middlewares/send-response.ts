import { FastifyReply, FastifyRequest } from 'fastify'
import { addDays } from 'date-fns'

import { DrizzleRefreshTokensRepository } from '@repositories/implementations'

import { GenericRequest } from '@utils/fastify/types'
import { env } from '@utils/env'
import { IResponse } from '@utils/response'
import { cookiesKeys } from '@utils/token'
import { optionalPromiseWrapper } from '@utils/functions'

type SendResponseMiddleware<T> = (
	req: FastifyRequest<GenericRequest>,
	res: FastifyReply
) => Promise<IResponse<T>>

type SendAuthResponseMiddleware = SendResponseMiddleware<{
	user: { id: string }
}>
type SendAuthResponseOptions = {
	accessTokenOnly?: boolean
}

export const sendResponse = <T = unknown>(middleware: SendResponseMiddleware<T>) => async(
	request: FastifyRequest<GenericRequest>,
	res: FastifyReply
) => {
	const { statusCode, ...result } = await middleware(request, res)
	return res.code(statusCode).send({ ...result })
}

export const sendAuthResponse = (
	middleware: SendAuthResponseMiddleware,
	options: SendAuthResponseOptions = {}
) => async(
	request: FastifyRequest<GenericRequest>,
	res: FastifyReply
) => {
	const { statusCode, process, body } = await middleware(request, res)
	if (process === 'failed') {
		return res.code(statusCode).send({ process, body })
	}

	const [accessToken, refreshToken] = await Promise.all([
		res.jwtSign({ userId: body.user.id }),
		optionalPromiseWrapper(
			!options?.accessTokenOnly,
			() => res.jwtSign({}, {
				sign: {
					key: env.AUTH_REFRESH_SECRET,
					expiresIn: env.AUTH_REFRESH_EXPIRES
				}
			})
		)
	])

	const cookieConfig = {
		secure: env.NODE_ENV === 'production', // send cookie over HTTPS only
		httpOnly: true,
		sameSite: 'strict' as const  // alternative CSRF protection
	}

	if (refreshToken !== undefined) {
		new DrizzleRefreshTokensRepository().create({
			userId: body.user.id,
			token: refreshToken,
			expiresAt: addDays(new Date(), parseInt(env.AUTH_REFRESH_EXPIRES))
		})
		res.setCookie(cookiesKeys.REFRESH_TOKEN, refreshToken, {
			...cookieConfig,
			path: '/auth/refresh'
		})
	}

	return res
		.setCookie(cookiesKeys.ACCESS_TOKEN, accessToken, {
			...cookieConfig,
			path: '/'
		})
		.setCookie(cookiesKeys.IS_AUTHENTICATED, 'true', {
			...cookieConfig,
			path: '/',
			httpOnly: false
		})
		.code(statusCode)
		.send({
			process,
			body: {}
		})
}