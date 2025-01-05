import { DrizzleCategoriesRepository } from '@repositories/implementations'

import { UseCaseHandler } from '@utils/use-case'

import { CreateCategory } from './CreateCategory'
import { ListCategories } from './ListCategories'
import { GetOneCategory } from './GetOneCategory'
import { UpdateCategory } from './UpdateCategory'
import { DeleteCategory } from './DeleteCategory'

export const createCategory = () => new UseCaseHandler(
	new CreateCategory(
		new DrizzleCategoriesRepository()
	)
)

export const listCategories = () => new UseCaseHandler(
	new ListCategories(
		new DrizzleCategoriesRepository()
	)
)

export const getOneCategory = () => new UseCaseHandler(
	new GetOneCategory(
		new DrizzleCategoriesRepository()
	)
)

export const updateCategory = () => new UseCaseHandler(
	new UpdateCategory(
		new DrizzleCategoriesRepository()
	)
)

export const deleteCategory = () => new UseCaseHandler(
	new DeleteCategory(
		new DrizzleCategoriesRepository()
	)
)