import { ICategory, TransactionType } from '@entities/index'
import { CustomOmit } from '@utils/types'

export type ICreateParams = CustomOmit<ICategory, 'id' | 'createdAt' | 'updatedAt'>

export type IFindManyParams = {
	userId?: string
	type?: TransactionType
	page?: number
}

export type ICountParams = CustomOmit<IFindManyParams, 'page'>

export type IUpdateParams = {
	id: string
	data: Partial<CustomOmit<ICreateParams, 'userId'>>
}

export interface ICategoriesRepository {
	create(params: ICreateParams): Promise<ICategory>
	createMany(params: ICreateParams[]): Promise<ICategory[]>
	findById(id: string): Promise<ICategory | null>
	findMany(params: IFindManyParams): Promise<ICategory[]>
	count(params: ICountParams): Promise<number>
	update(params: IUpdateParams): Promise<ICategory>
	delete(id: string): Promise<void>
}