import { FastifyRequest } from 'fastify'

import { UnknownObject } from '@utils/types'
import { GenericRequest } from '@utils/fastify/types'

type AddCookiesToBodyOptions = {
	mapCookies?: { [key: string]: string }
}

export const addCookiesToBody = (
	options?: AddCookiesToBodyOptions
) => async(req: FastifyRequest<GenericRequest>): Promise<void> => {
	const body = (req.body || {}) as UnknownObject
	Object.keys(req.cookies).forEach(key => {
		if (options?.mapCookies !== undefined && options.mapCookies[key] !== undefined) {
			body[options.mapCookies[key]] = req.cookies[key]
			return
		}
		body[key] = req.cookies[key]
	})
	req.body = body
}