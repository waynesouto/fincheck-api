import { FastifyInstance } from 'fastify'

import { applyUseCase } from '@http/middlewares/apply-use-case'
import { sendResponse } from '@http/middlewares/send-response'

import { getUser } from '@use-cases/users'

export const usersRoutes = async(fastify: FastifyInstance) => {
	const onRequest = [fastify.authenticate]

	fastify.get('/users/me', { onRequest }, sendResponse(applyUseCase(getUser)))
}