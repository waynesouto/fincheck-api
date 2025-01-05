import { and, count, desc, eq, getTableColumns, sql, SQL } from 'drizzle-orm'

import { IBankAccount, TransactionTypeEnum } from '@entities/index'
import { drizzle, withPagination } from '@clients/drizzle'
import { bankAccounts, transactions } from '@drizzle/schema'
import { IBankAccountsRepository, ICountParams, ICreateParams, IFindByIdExtendedResponse, IFindManyParams, IFindManyResponse, IUpdateParams } from '@repositories/IBankAccountsRepository'

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

	async findByIdExtended(id: string): Promise<IFindByIdExtendedResponse | null> {
		const balances = drizzle.$with('balances').as(
			drizzle
				.select({
					bankAccountId: transactions.bankAccountId,
					currentBalance: sql`
						coalesce(sum(
							case when ${eq(transactions.type, TransactionTypeEnum.income)}
							then ${transactions.value}
							else -${transactions.value}
						end), 0)`.mapWith(Number).as('current_balance'),
					totalIncomes: sql`
						coalesce(sum(
							case when ${eq(transactions.type, TransactionTypeEnum.income)}
							then ${transactions.value}
							else 0
						end), 0)`.mapWith(Number).as('total_incomes'),
					totalExpenses: sql`
						coalesce(sum(
							case when ${eq(transactions.type, TransactionTypeEnum.expense)}
							then ${transactions.value}
							else 0
						end), 0)`.mapWith(Number).as('total_expense')
				})
				.from(transactions)
				.where(eq(transactions.bankAccountId, id))
				.groupBy(transactions.bankAccountId)
		)

		return await drizzle.with(balances)
			.select({
				...getTableColumns(bankAccounts),
				currentBalance: sql`${bankAccounts.initialBalance}+coalesce(${balances.currentBalance}, 0)`
					.mapWith(Number),
				totalIncomes: balances.totalIncomes,
				totalExpenses: balances.totalExpenses
			})
			.from(bankAccounts)
			.leftJoin(balances, eq(bankAccounts.id, balances.bankAccountId))
			.where(eq(bankAccounts.id, id))
			.then(([result]) => result || null)
	}

	async findMany({ page, ...filters }: IFindManyParams): Promise<IFindManyResponse> {
		const balances = drizzle.$with('balances').as(
			drizzle
				.select({
					bankAccountId: transactions.bankAccountId,
					currentBalance: sql`
						coalesce(sum(
							case when ${eq(transactions.type, TransactionTypeEnum.income)}
							then ${transactions.value}
							else -${transactions.value}
						end), 0)`.mapWith(Number).as('current_balance')
				})
				.from(transactions)
				.where(eq(transactions.userId, filters.userId))
				.groupBy(transactions.bankAccountId)
		)

		const dynamicQuery = drizzle.with(balances)
			.select({
				...getTableColumns(bankAccounts),
				currentBalance: sql`${bankAccounts.initialBalance}+coalesce(${balances.currentBalance}, 0)`
					.mapWith(Number)
			})
			.from(bankAccounts)
			.leftJoin(balances, eq(bankAccounts.id, balances.bankAccountId))
			.where(and(...this.mountWhere(filters)))
			.orderBy(desc(bankAccounts.createdAt))
			.$dynamic()

		return await withPagination(dynamicQuery, page)
	}

	async count(filters: ICountParams): Promise<number> {
		return drizzle
			.select({ count: count() })
			.from(bankAccounts)
			.where(and(...this.mountWhere(filters)))
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