import { FastifyInstance, FastifyReply } from 'fastify'

import { applyUseCase } from '@http/middlewares/apply-use-case'
import { sendAuthResponse, sendResponse } from '@http/middlewares/send-response'
import { addCookiesToBody } from '@http/middlewares/add-cookies-to-body'

import { accessTokenCookieName, isAuthenticatedCookieName, refreshTokenCookieName } from '@utils/token'

import { generateAccessToken, login, logout, register } from '@use-cases/auth'

export const authRoutes = async(fastify: FastifyInstance) => {
	const preValidation = [
		addCookiesToBody({
			mapCookies: { [refreshTokenCookieName]: 'refreshToken' }
		})
	]

	fastify.post('/auth/register', sendAuthResponse(applyUseCase(register)))

	fastify.post('/auth/login', sendAuthResponse(applyUseCase(login)))

	fastify.post(
		'/auth/refresh',
		{
			preValidation,
			onSend: async(_, res) => {
				if (res.statusCode !== 200) {
					clearCookies(res)
				}
			}
		},
		sendAuthResponse(applyUseCase(generateAccessToken), { accessTokenOnly: true })
	)

	fastify.delete(
		'/auth/refresh',
		{
			preValidation,
			onSend: async(_, res) => clearCookies(res)
		},
		sendResponse(applyUseCase(logout))
	)
}

const clearCookies = (res: FastifyReply) => {
	res
		.clearCookie(accessTokenCookieName)
		.clearCookie(refreshTokenCookieName, { path: '/auth/refresh' })
		.clearCookie(isAuthenticatedCookieName)
}