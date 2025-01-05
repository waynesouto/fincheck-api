import v from '@vinejs/vine'

import { ICategoriesRepository } from '@repositories/ICategoriesRepository'

import { ICategory, TransactionTypeEnum } from '@entities/index'

import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { validator } from '@utils/validator'

type CreateCategoryRequest = {
	userId: string
	data: Pick<ICategory, 'name' | 'type' | 'icon'>
}
type CreateCategoryResponse = {
	category: ICategory
}

type T = CreateCategoryRequest
type K = CreateCategoryResponse

export type ICreateCategory = IWrappedUseCase<T, K>

export class CreateCategory implements IUseCase<T, K> {
	constructor(
		private readonly categoriesRepository: ICategoriesRepository
	) {}

	async execute({ userId, data }: T): Promise<K> {
		const category = await this.categoriesRepository.create({ ...data, userId })

		return { category }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			data: v.object({
				name: v.string().minLength(3),
				type: v.enum(TransactionTypeEnum),
				icon: v.string().minLength(3)
			})
		})
		return await validator(schema, data)
	}

}