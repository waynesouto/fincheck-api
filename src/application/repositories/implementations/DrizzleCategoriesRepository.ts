import { and, count, desc, eq, SQL, sql } from 'drizzle-orm'

import { ICategory } from '@entities/ICategory'
import { drizzle, withPagination } from '@clients/drizzle'
import { categories } from '@drizzle/schema'
import { ICategoriesRepository, ICountParams, ICreateParams, IFindManyParams, IUpdateParams } from '@repositories/ICategoriesRepository'

type IMountWhereParams = IFindManyParams | ICountParams

export class DrizzleCategoriesRepository implements ICategoriesRepository {
	private findByIdQuery = drizzle.query.categories.findFirst({
		where: eq(categories.id, sql.placeholder('id'))
	}).prepare('findCategoryById')

	async create(data: ICreateParams): Promise<ICategory> {
		return await drizzle
			.insert(categories)
			.values(data)
			.returning()
			.then(([result]) => result)
	}

	async createMany(data: ICreateParams[]): Promise<ICategory[]> {
		return await drizzle
			.insert(categories)
			.values(data)
			.returning()
			.then((result) => result)
	}

	async findById(id: string): Promise<ICategory | null> {
		return await this.findByIdQuery.execute({ id }).then(result => result || null)
	}

	async findMany({ page, ...filters }: IFindManyParams): Promise<ICategory[]> {
		const dynamicQuery = drizzle
			.select()
			.from(categories)
			.where(and(...this.mountWhere(filters)))
			.orderBy(desc(categories.createdAt))
			.$dynamic()

		return await withPagination(dynamicQuery, page)
	}

	async count(filter: ICountParams): Promise<number> {
		return drizzle
			.select({ count: count() })
			.from(categories)
			.where(and(...this.mountWhere(filter)))
			.then(([result]) => result.count)
	}

	async update({ id, data }: IUpdateParams): Promise<ICategory> {
		return await drizzle
			.update(categories)
			.set(data)
			.where(eq(categories.id, id))
			.returning()
			.then(([result]) => result)
	}

	async delete(id: string): Promise<void> {
		await drizzle
			.delete(categories)
			.where(eq(categories.id, id))
	}

	private mountWhere({
		userId, type
	}: IMountWhereParams): SQL[] {
		const where: SQL[] = []
		if (userId !== undefined) {
			where.push(eq(categories.userId, userId))
		}
		if (type !== undefined) {
			where.push(eq(categories.type, type))
		}

		return where
	}
}