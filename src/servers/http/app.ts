import fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import compress from '@fastify/compress'
import cors from '@fastify/cors'

import { routes } from '@http/routes'
import { authenticate } from '@http/middlewares/authenticate'

import { isHttpException } from '@utils/exception'
import { responseLogger } from '@utils/logger'
import { IFailedResponse, ProcessOptions } from '@utils/response'
import { GenericRequest } from '@utils/fastify/types'
import { env } from '@utils/env'
import { accessTokenCookieName } from '@utils/token'

declare module 'fastify' {
	interface FastifyInstance {
		authenticate: (
			req: FastifyRequest<GenericRequest>,
			res: FastifyReply
		) => Promise<IFailedResponse | void>
	}
}

const app = fastify({
	ignoreTrailingSlash: true
})

// plugins
app.register(cookie, { hook: 'onRequest' })
app.register(compress)
app.register(cors, {
	origin: (origin, cb) => {
		cb(null, origin || true)
	},
	credentials: true
})

app.register(jwt, {
	secret: env.AUTH_ACCESS_SECRET,
	sign: { expiresIn: env.AUTH_ACCESS_EXPIRES },
	cookie: {
		cookieName: accessTokenCookieName,
		signed: false
	}
})

// internal
app.register(routes)

// decorators
app.decorate('authenticate', authenticate())

// error handler
app.setErrorHandler((error, req, res) => {
	if (isHttpException(error)) {
		return res
			.status(error.statusCode)
			.send({ process: error.process, body: error.body })
	}

	responseLogger({
		body: JSON.stringify(error.message, null, 2),
		process: ProcessOptions.FAILED,
		route: `${req.method} ${req.originalUrl}`,
		statusCode: 500
	})

	return res.status(500).send({
		process: 'failed',
		body: 'Internal server error'
	})
})

export default app