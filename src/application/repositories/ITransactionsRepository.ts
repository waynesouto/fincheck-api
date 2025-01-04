import { ITransaction, TransactionType } from '@entities/index'
import { CustomOmit } from '@utils/types'

export type ICreateParams = CustomOmit<ITransaction, 'id' | 'createdAt' | 'updatedAt'>

export type IFindManyParams = {
	userId: string
	type?: TransactionType
	page?: number
}

export type ICountParams = CustomOmit<IFindManyParams, 'page'>

export type IUpdateParams = {
	id: string
	data: Partial<ICreateParams>
}

export interface ITransactionsRepository {
	create(params: ICreateParams): Promise<ITransaction>
	findById(id: string): Promise<ITransaction | null>
	findMany(params: IFindManyParams): Promise<ITransaction[]>
	count(params: ICountParams): Promise<number>
	update(params: IUpdateParams): Promise<ITransaction>
	delete(id: string): Promise<void>
}