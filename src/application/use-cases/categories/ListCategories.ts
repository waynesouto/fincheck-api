import v from '@vinejs/vine'

import { ICategoriesRepository, ICountParams } from '@repositories/ICategoriesRepository'

import { ICategory, TransactionType, TransactionTypeEnum } from '@entities/index'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { createPaginationResult, IPagination } from '@utils/pagination'
import { optionalPromiseWrapper } from '@utils/functions'

type ListCategoriesRequest = {
	userId: string
	data: Partial<{
		page: number
		type: TransactionType
	}>
}
type ListCategoriesResponse = {
	categories: ICategory[]
	pagination?: IPagination
}

type T = ListCategoriesRequest
type K = ListCategoriesResponse

export type IListCategories = IWrappedUseCase<T, K>

export class ListCategories implements IUseCase<T, K> {
	constructor(
		private readonly categoriesRepository: ICategoriesRepository
	) {}

	async execute({ userId, data }: T): Promise<K> {
		const { page, type } = data
		const filters: ICountParams = {
			userId,
			type
		}

		const [categories, pagination] = await Promise.all([
			this.categoriesRepository.findMany({ ...filters, page }),
			optionalPromiseWrapper(
				page === 1,
				() => createPaginationResult(this.categoriesRepository.count(filters))
			)
		])

		return { categories, pagination }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			data: v.object({
				page: v.number().optional(),
				type: v.enum(TransactionTypeEnum).optional()
			})
		})
		return await validator(schema, data)
	}
}