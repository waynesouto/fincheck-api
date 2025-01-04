import { IRefreshToken } from '@entities/IRefreshToken'
import { drizzle } from '@clients/drizzle'
import { ICreateParams, IDeleteParams, IFindFirstParams, IRefreshTokensRepository } from '@repositories/IRefreshTokensRepository'
import { refreshTokens } from '@drizzle/schema'
import { eq, sql } from 'drizzle-orm'

export class DrizzleRefreshTokensRepository implements IRefreshTokensRepository {
	private findFirstQuery = drizzle.query.refreshTokens.findFirst({
		where: eq(refreshTokens.token, sql.placeholder('token'))
	}).prepare('findFirstRefreshToken')

	private deleteQuery = drizzle
		.delete(refreshTokens)
		.where(eq(refreshTokens.token, sql.placeholder('token')))
		.prepare('deleteRefreshToken')

	async create(data: ICreateParams): Promise<IRefreshToken> {
		return await drizzle
			.insert(refreshTokens)
			.values(data)
			.returning()
			.then(([result]) => result)
	}

	async findFirst(params: IFindFirstParams): Promise<IRefreshToken | null> {
		return await this.findFirstQuery.execute(params).then(result => result || null)
	}

	async delete(params: IDeleteParams): Promise<void> {
		await this.deleteQuery.execute(params)
	}
}