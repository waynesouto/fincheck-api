import { and, between, count, eq, getTableColumns, SQL, sql } from 'drizzle-orm'

import { ITransaction } from '@entities/ITransaction'
import { drizzle, withPagination } from '@clients/drizzle'
import { categories, transactions } from '@drizzle/schema'
import { ICountParams, ICreateParams, IFindManyParams, IFindManyResponse, ISumParams, ITransactionsRepository, IUpdateParams } from '@repositories/ITransactionsRepository'

type IMountWhereParams = IFindManyParams | ICountParams

export class DrizzleTransactionsRepository implements ITransactionsRepository {
	private createQuery = drizzle
		.insert(transactions)
		.values({
			userId: sql.placeholder('userId'),
			bankAccountId: sql.placeholder('bankAccountId'),
			date: sql.placeholder('date'),
			description: sql.placeholder('description'),
			type: sql.placeholder('type'),
			value: sql.placeholder('value'),
			categoryId: sql.placeholder('categoryId')
		})
		.returning()
		.prepare('createTransaction')

	private findByIdQuery = drizzle.query.transactions.findFirst({
		where: eq(transactions.id, sql.placeholder('id'))
	})
		.prepare('findTransactionById')

	private deleteQuery = drizzle
		.delete(transactions)
		.where(eq(transactions.id, sql.placeholder('id')))
		.prepare('deleteTransaction')

	async create(data: ICreateParams): Promise<ITransaction> {
		return await this.createQuery.execute(data).then(([result]) => result)
	}

	async findById(id: string): Promise<ITransaction | null> {
		return await this.findByIdQuery.execute({ id }).then(result => result || null)
	}

	async findMany({ page, ...filters }: IFindManyParams): Promise<IFindManyResponse> {
		const dynamicQuery = drizzle
			.select({
				...getTableColumns(transactions),
				category: getTableColumns(categories)
			})
			.from(transactions)
			.leftJoin(categories, eq(transactions.categoryId, categories.id))
			.where(and(...this.mountWhere(filters)))
			.$dynamic()

		return await withPagination(dynamicQuery, page)
	}

	async count(filters: ICountParams): Promise<number> {
		return await drizzle
			.select({ count: count() })
			.from(transactions)
			.where(and(...this.mountWhere(filters)))
			.then(([result]) => result.count)
	}

	async sum(filters: ISumParams): Promise<number> {
		return await drizzle
			.select({
				sum: sql<number>`COALESCE(SUM(${transactions.value}), 0)`
			})
			.from(transactions)
			.where(and(...this.mountWhere(filters)))
			.then(([result]) => result.sum)
	}

	async update({ id, data }: IUpdateParams): Promise<ITransaction> {
		return drizzle
			.update(transactions)
			.set(data)
			.where(eq(transactions.id, id))
			.returning()
			.then(([result]) => result)
	}

	async delete(id: string): Promise<void> {
		await this.deleteQuery.execute({ id })
	}

	private mountWhere({
		userId, type, bankAccountId, date
	}: IMountWhereParams): SQL[] {
		const where:SQL[] = []
		if (userId !== undefined) {
			where.push(eq(transactions.userId, userId))
		}
		if (type !== undefined) {
			where.push(eq(transactions.type, type))
		}
		if (bankAccountId !== undefined) {
			where.push(eq(transactions.bankAccountId, bankAccountId))
		}
		if (date !== undefined) {
			where.push(between(transactions.date, date.start, date.end))
		}
		return where
	}

}