import type { Config } from 'drizzle-kit'

import { env } from './src/shared/utils/env'

export default {
	schema: './drizzle/schema.ts',
	out: './drizzle/migrations',
	dialect: 'postgresql',
	migrations: {
		prefix: 'timestamp'
	},
	dbCredentials: {
		url: env.DATABASE_URL
	}
} satisfies Config