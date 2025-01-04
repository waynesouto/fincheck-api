import { IRefreshToken } from '@entities/IRefreshToken'

import { CustomOmit } from '@utils/types'

export type ICreateParams = CustomOmit<IRefreshToken, 'id' | 'createdAt' | 'updatedAt'>

export type IFindFirstParams = {
	token: string
}

export type IDeleteParams = IFindFirstParams

export interface IRefreshTokensRepository {
	create(params: ICreateParams): Promise<IRefreshToken>
	findFirst(params: IFindFirstParams): Promise<IRefreshToken | null>
	delete(params: IDeleteParams): Promise<void>
}