import { ICategory, ITransaction, TransactionType } from '@entities/index'
import { CustomOmit } from '@utils/types'

export type ICreateParams = CustomOmit<ITransaction, 'id' | 'createdAt' | 'updatedAt'>

export type IFindManyParams = {
	userId?: string
	type?: TransactionType
	page?: number
}

export type IFindManyResponse = Array<{
	category: ICategory | null
} & ITransaction>

export type ICountParams = CustomOmit<IFindManyParams, 'page'>

export type ISumParams = ICountParams

export type IUpdateParams = {
	id: string
	data: Partial<ICreateParams>
}

export interface ITransactionsRepository {
	create(params: ICreateParams): Promise<ITransaction>
	findById(id: string): Promise<ITransaction | null>
	findMany(params: IFindManyParams): Promise<IFindManyResponse>
	count(params: ICountParams): Promise<number>
	sum(params: ISumParams): Promise<number>
	update(params: IUpdateParams): Promise<ITransaction>
	delete(id: string): Promise<void>
}