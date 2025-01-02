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
}

const envSchema: Require<JSONSchemaType<IEnv>, '$id'> = {
	$id: 'env',
	type: 'object',
	properties: {
		TZ: { type: 'string', default: 'America/Sao_Paulo' },
		NODE_ENV: { type: 'string', enum: ['local', 'production'] },
		PORT: { type: 'integer', minimum: 1, default: 3000 },
		DATABASE_URL: { type: 'string' },
		AUTH_ACCESS_SECRET: { type: 'string', minLength: 32 },
		AUTH_ACCESS_EXPIRES: { type: 'string', minLength: 2 }
	},
	required: ['NODE_ENV', 'PORT', 'DATABASE_URL', 'AUTH_ACCESS_SECRET', 'AUTH_ACCESS_EXPIRES']
}

const validated = ajv.compile(envSchema)
if (!validated(process.env)) {
	throw new Error(`Invalid environment variables: ${JSON.stringify(validated.errors)}`)
}

export const env = process.env as unknown as IEnv