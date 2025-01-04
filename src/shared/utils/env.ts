import { JSONSchemaType } from 'ajv'

import { Require } from '@utils/types'
import { ajv } from '@clients/ajv'

type IEnv = {
	// settings
	TZ: string
	NODE_ENV: 'local' | 'production'
	PORT: number
	// clients
	DATABASE_URL: string
	// auth
	AUTH_ACCESS_SECRET: string
	AUTH_ACCESS_EXPIRES: string
	AUTH_REFRESH_SECRET: string
	AUTH_REFRESH_EXPIRES: string
}

let _env: IEnv | null = null

if (_env === null) {
	const envSchema: Require<JSONSchemaType<IEnv>, '$id'> = {
		$id: 'env',
		type: 'object',
		properties: {
			TZ: { type: 'string', default: 'America/Sao_Paulo' },
			NODE_ENV: { type: 'string', enum: ['local', 'production'] },
			PORT: { type: 'integer', minimum: 1, default: 3000 },
			DATABASE_URL: { type: 'string' },
			AUTH_ACCESS_SECRET: { type: 'string', minLength: 32 },
			AUTH_ACCESS_EXPIRES: { type: 'string', minLength: 2 },
			AUTH_REFRESH_SECRET: { type: 'string', minLength: 32 },
			AUTH_REFRESH_EXPIRES: { type: 'string', minLength: 2 }
		},
		required: ['NODE_ENV', 'PORT', 'DATABASE_URL', 'AUTH_ACCESS_SECRET', 'AUTH_ACCESS_EXPIRES']
	}

	// use ajv to validate the environment variables
	// vinejs don't have a sync validation method implemented
	// when it does, we can use it to validate the environment variables
	const validated = ajv.compile(envSchema)
	if (!validated(process.env)) {
		throw new Error(`Invalid environment variables: ${JSON.stringify(validated.errors)}`)
	}
}

_env = process.env as unknown as IEnv

export const env = _env