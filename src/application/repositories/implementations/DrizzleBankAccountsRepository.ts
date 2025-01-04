import { and, count, desc, eq, sql, SQL } from 'drizzle-orm'

import { IBankAccount } from '@entities/IBankAccount'
import { drizzle, withPagination } from '@clients/drizzle'
import { bankAccounts } from '@drizzle/schema'
import { IBankAccountsRepository, ICountParams, ICreateParams, IFindManyParams, IUpdateParams } from '@repositories/IBankAccountsRepository'

type IMountWhereParams = IFindManyParams | ICountParams

export class DrizzleBankAccountsRepository implements IBankAccountsRepository {
	private findByIdQuery = drizzle.query.bankAccounts.findFirst({
		where: eq(bankAccounts.id, sql.placeholder('id'))
	}).prepare('findBankAccountById')

	async create(data: ICreateParams): Promise<IBankAccount> {
		return await drizzle
			.insert(bankAccounts)
			.values(data)
			.returning()
			.then(([result]) => result)
	}

	async findById(id: string): Promise<IBankAccount | null> {
		return await this.findByIdQuery.execute({ id }).then(result => result || null)
	}

	async findMany({ page, ...filters }: IFindManyParams): Promise<IBankAccount[]> {
		const dynamicQuery = drizzle
			.select()
			.from(bankAccounts)
			.where(and(...this.mountWhere(filters)))
			.orderBy(desc(bankAccounts.createdAt))
			.$dynamic()

		return await withPagination(dynamicQuery, page)
	}

	async count(filter: ICountParams): Promise<number> {
		return drizzle
			.select({ count: count() })
			.from(bankAccounts)
			.where(and(...this.mountWhere(filter)))
			.then(([result]) => result.count)
	}

	async update({ id, data }: IUpdateParams): Promise<IBankAccount> {
		return await drizzle
			.update(bankAccounts)
			.set(data)
			.where(eq(bankAccounts.id, id))
			.returning()
			.then(([result]) => result)
	}

	async delete(id: string): Promise<void> {
		await drizzle
			.delete(bankAccounts)
			.where(eq(bankAccounts.id, id))
	}

	private mountWhere({
		userId, type
	}: IMountWhereParams): SQL[] {
		const where: SQL[] = [eq(bankAccounts.userId, userId)]
		if (type !== undefined) {
			where.push(eq(bankAccounts.type, type))
		}

		return where
	}
}