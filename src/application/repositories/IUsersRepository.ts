import { IUser } from '@entities/IUser'
import { CustomOmit } from '@utils/types'

export type ICreateParams = CustomOmit<IUser, 'id' | 'createdAt' | 'updatedAt'>

export type IFindFirstParams = {
	email: string
}

export type IUpdateParams = {
	id: string
	data: Partial<CustomOmit<ICreateParams, 'email'>>
}

export interface IUsersRepository {
	create(params: ICreateParams): Promise<IUser>
	findById(id: string): Promise<IUser | null>
	findFirst(params: IFindFirstParams): Promise<IUser | null>
	update(params: IUpdateParams): Promise<IUser>
}