import v from '@vinejs/vine'

import { ICategoriesRepository } from '@repositories/ICategoriesRepository'

import { ICategory, TransactionTypeEnum } from '@entities/index'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { validateResourceOwnership } from '@utils/resource'

type UpdateCategoryRequest = {
	userId: string
	id: string
	data: Partial<
		Pick<
			ICategory,
			| 'name'
			| 'type'
			| 'icon'
		>>
}
type UpdateCategoryResponse = {
	category: ICategory
}

type T = UpdateCategoryRequest
type K = UpdateCategoryResponse

export type IUpdateCategory = IWrappedUseCase<T, K>

export class UpdateCategory implements IUseCase<T, K> {
	constructor(
		private readonly categoriesRepository: ICategoriesRepository
	) {}

	async execute({ userId, id, data }: T): Promise<K> {
		await this.categoriesRepository
			.findById(id)
			.then(category => validateResourceOwnership(category, userId, 'Category'))

		const category = await this.categoriesRepository.update({ id, data })

		return { category }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			id: v.string(),
			data: v.object({
				name: v.string().optional(),
				type: v.enum(TransactionTypeEnum).optional(),
				icon: v.string().optional()
			})
		})
		return await validator(schema, data)
	}
}