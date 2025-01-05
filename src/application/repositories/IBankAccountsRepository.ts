import { BankAccountType, IBankAccount } from '@entities/index'
import { CustomOmit } from '@utils/types'

export type ICreateParams = CustomOmit<IBankAccount, 'id' | 'createdAt' | 'updatedAt'>

export type IFindManyParams = {
	userId: string
	type?: BankAccountType
	page?: number
}

export type IFindManyResponse = Array<{ currentBalance: number } & IBankAccount>

export type IFindByIdExtendedResponse = {
	currentBalance: number
	totalIncomes: number
	totalExpenses: number
} & IBankAccount

export type ICountParams = CustomOmit<IFindManyParams, 'page'>

export type IUpdateParams = {
	id: string
	data: Partial<CustomOmit<ICreateParams, 'userId'>>
}

export interface IBankAccountsRepository {
	create(params: ICreateParams): Promise<IBankAccount>
	findById(id: string): Promise<IBankAccount | null>
	findByIdExtended(id: string): Promise<IFindByIdExtendedResponse | null>
	findMany(params: IFindManyParams): Promise<IFindManyResponse>
	count(params: ICountParams): Promise<number>
	update(params: IUpdateParams): Promise<IBankAccount>
	delete(id: string): Promise<void>
}