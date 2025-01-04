import { BankAccountType, IBankAccount } from '@entities/index'
import { CustomOmit } from '@utils/types'

export type ICreateParams = CustomOmit<IBankAccount, 'id' | 'createdAt' | 'updatedAt'>

export type IFindManyParams = {
	userId: string
	type?: BankAccountType
	page?: number
}

export type ICountParams = CustomOmit<IFindManyParams, 'page'>

export type IUpdateParams = {
	id: string
	data: Partial<ICreateParams>
}

export interface IBankAccountsRepository {
	create(params: ICreateParams): Promise<IBankAccount>
	findById(id: string): Promise<IBankAccount | null>
	findMany(params: IFindManyParams): Promise<IBankAccount[]>
	count(params: ICountParams): Promise<number>
	update(params: IUpdateParams): Promise<IBankAccount>
	delete(id: string): Promise<void>
}