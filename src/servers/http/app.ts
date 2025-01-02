import fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'

import ajvKeywords from 'ajv-keywords'

import { formatValidationError } from '@clients/ajv'

import { routes } from '@http/routes'
import { docs } from '@http/docs'
import { authenticate } from '@http/middlewares/authenticate'

import { BadRequestException, isHttpException } from '@utils/exception'
import { responseLogger } from '@utils/logger'
import { IFailedResponse, ProcessOptions } from '@utils/response'
import { GenericRequest } from '@utils/fastify/types'
import { env } from '@utils/env'

declare module 'fastify' {
	interface FastifyInstance {
		authenticate: (
			req: FastifyRequest<GenericRequest>,
			res: FastifyReply
		) => Promise<IFailedResponse | void>
	}
}

// plugins
const app = fastify({
	ajv: { plugins: [[ajvKeywords, 'transform']] },
	ignoreTrailingSlash: true
})
app.register(cookie, { hook: 'onRequest' })

const tokenSuffix = env.NODE_ENV === 'production' ? '' : '-homolog'
app.register(jwt, {
	secret: env.AUTH_ACCESS_SECRET,
	sign: { expiresIn: env.AUTH_ACCESS_EXPIRES },
	cookie: {
		cookieName: `@fincheck:access-token${tokenSuffix}`,
		signed: false
	}
})

// internal
app.register(routes)
app.register(docs)

// decorators
app.decorate('authenticate', authenticate())

// error handler
app.setErrorHandler((error, req, reply) => {
	if (error.validation) {
		return reply
			.status(400)
			.send(new BadRequestException(formatValidationError(error.validation)))
	}
	if (isHttpException(error)) {
		return reply
			.status(error.status_code)
			.send({ process: error.process, body: error.body })
	}

	responseLogger({
		body: JSON.stringify(error.message, null, 2),
		process: ProcessOptions.FAILED,
		route: `${req.method} ${req.originalUrl}`,
		status_code: 500
	})

	return reply.status(500).send({
		process: 'failed',
		body: 'Internal server error'
	})
})

export default app