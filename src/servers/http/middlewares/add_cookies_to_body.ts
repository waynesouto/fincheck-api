import { FastifyRequest } from 'fastify'

import { UnknownObject } from '@utils/types'
import { GenericRequest } from '@utils/fastify/types'

type AddCookiesToBodyOptions = {
	map_cookies?: { [key: string]: string }
}

export const addCookiesToBody = (
	options?: AddCookiesToBodyOptions
) => async(req: FastifyRequest<GenericRequest>): Promise<void> => {
	const body = (req.body || {}) as UnknownObject
	Object.keys(req.cookies).forEach(key => {
		if (options?.map_cookies !== undefined && options.map_cookies[key] !== undefined) {
			body[options.map_cookies[key]] = req.cookies[key]
			return
		}
		body[key] = req.cookies[key]
	})
	req.body = body
}