import postgres from 'postgres'
import { drizzle as drizzleClient } from 'drizzle-orm/postgres-js'
import { is, sql, SQL } from 'drizzle-orm'
import { PgSelect, PgTimestampString, SelectedFields } from 'drizzle-orm/pg-core'
import { SelectResultFields } from 'drizzle-orm/query-builders/select.types'

import * as schema from '@drizzle/index'
import { defaultPageSize, paginate } from '@utils/pagination'
import { env } from '@utils/env'

export const drizzle = drizzleClient(postgres(env.DATABASE_URL), { schema })

export const withPagination = <T extends PgSelect>(
	queryBuilder: T,
	page: number | undefined,
	pageSize: number | undefined = defaultPageSize
): T => {
	const { limit, offset } = paginate(page, pageSize)

	if (limit !== undefined && offset !== undefined) {
		return queryBuilder
			.limit(limit)
			.offset(offset)
	}

	return queryBuilder
}

export const jsonBuildObject = <T extends SelectedFields>(shape: T) => {
	const chunks: SQL[] = []

	Object.entries(shape).forEach(([key, value]) => {
		if (chunks.length > 0) {
			chunks.push(sql.raw(','))
		}

		chunks.push(sql.raw(`'${key}',`))

		// json_build_object formats to ISO 8601 ...
		if (is(value, PgTimestampString)) {
			chunks.push(sql`timezone('UTC', ${value})`)
		} else {
			chunks.push(sql`${value}`)
		}
	})

	return sql<SelectResultFields<T>>`coalesce(json_build_object(${sql.join(chunks)}), '{}')`
}

export const jsonAggBuildObject = <T extends SelectedFields>(shape: T, filter?: SQL) => {
	return sql<SelectResultFields<T>[]>`coalesce(jsonb_agg(${jsonBuildObject(
		shape
	)}) ${filter}, '${sql`[]`}')`
}