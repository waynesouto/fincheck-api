import v from '@vinejs/vine'
import { isAfter } from 'date-fns'

import { IRefreshTokensRepository } from '@repositories/IRefreshTokensRepository'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { NotFoundException, UnauthorizedException } from '@utils/exception'

type GenerateAccessTokenRequest = {
	refreshToken: string
}
type GenerateAccessTokenResponse = {
	user: { id: string }
}

type T = GenerateAccessTokenRequest
type K = GenerateAccessTokenResponse

export type IGenerateAccessToken = IWrappedUseCase<T, K>

export class GenerateAccessToken implements IUseCase<T, K> {
	constructor(
		private readonly refreshTokensRepository: IRefreshTokensRepository
	) {}

	async execute({ refreshToken }: T): Promise<K> {
		const token = await this.refreshTokensRepository.findFirst({ token: refreshToken })
		if (token === null) {
			throw new NotFoundException('Refresh token not found')
		}
		if (isAfter(new Date(), token.expiresAt)) {
			throw new UnauthorizedException('Unauthorized refresh token')
		}

		return { user: { id: token.userId } }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			refreshToken: v.string()
		})
		return await validator(schema, data)
	}
}