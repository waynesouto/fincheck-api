import v from '@vinejs/vine'

import { ICategoriesRepository } from '@repositories/ICategoriesRepository'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { EmptyObject } from '@utils/types'
import { validateResourceOwnership } from '@utils/resource'

type DeleteCategoryRequest = {
	userId: string
	id: string
}
type DeleteCategoryResponse = EmptyObject

type T = DeleteCategoryRequest
type K = DeleteCategoryResponse

export type IDeleteCategory = IWrappedUseCase<T, K>

export class DeleteCategory implements IUseCase<T, K> {
	constructor(
		private readonly categoriesRepository: ICategoriesRepository
	) {}

	async execute({ userId, id }: T): Promise<K> {
		await this.categoriesRepository
			.findById(id)
			.then(category => validateResourceOwnership(category, userId, 'Category'))

		await this.categoriesRepository.delete(id)

		return {}
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			id: v.string()
		})
		return await validator(schema, data)
	}
}