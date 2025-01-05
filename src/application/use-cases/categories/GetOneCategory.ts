import v from '@vinejs/vine'

import { ICategory } from '@entities/ICategory'

import { ICategoriesRepository } from '@repositories/ICategoriesRepository'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { validateResourceOwnership } from '@utils/resource'

type GetOneCategoryRequest = {
	userId: string
	id: string
}
type GetOneCategoryResponse = {
	category: ICategory
}

type T = GetOneCategoryRequest
type K = GetOneCategoryResponse

export type IGetOneCategory = IWrappedUseCase<T, K>

export class GetOneCategory implements IUseCase<T, K> {
	constructor(
		private readonly categoriesRepository: ICategoriesRepository
	) {}

	async execute({ userId, id }: T): Promise<K> {
		const category = await this.categoriesRepository
			.findById(id)
			.then(category => validateResourceOwnership(category, userId, 'Category'))

		return { category }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			id: v.string()
		})
		return await validator(schema, data)
	}
}