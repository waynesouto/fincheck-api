import { FastifyInstance } from 'fastify'
import swagger from '@fastify/swagger'
import scalar from '@scalar/fastify-api-reference'

export const docs = async(fastify: FastifyInstance) => {
	fastify.register(swagger, {
		openapi: {
			info: {
				title: 'fincheck',
				version: '1.0.0'
			},
			components: {
				securitySchemes: {
					apiKey: {
						type: 'apiKey',
						in: 'cookie',
						name: '@fincheck:access-token'
					}
				}
			}
		}
	})
	fastify.register(scalar, {
		routePrefix: '/reference',
		configuration: {
			defaultHttpClient: {
				targetKey: 'node',
				clientKey: 'fetch'
			},
			theme: 'green'
		}
	})
}