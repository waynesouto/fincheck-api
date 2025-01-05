import v from '@vinejs/vine'

import { IRefreshTokensRepository } from '@repositories/IRefreshTokensRepository'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { EmptyObject } from '@utils/types'

type LogoutRequest = {
	refreshToken: string
}
type LogoutResponse = EmptyObject

type T = LogoutRequest
type K = LogoutResponse

export type ILogout = IWrappedUseCase<T, K>

export class Logout implements IUseCase<T, K> {
	constructor(
		private readonly refreshTokensRepository: IRefreshTokensRepository
	) {}

	async execute({ refreshToken }: T): Promise<K> {
		// no need to wait the deletion
		this.refreshTokensRepository.delete({ token: refreshToken })
		return {}
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			refreshToken: v.string()
		})
		return await validator(schema, data)
	}
}
