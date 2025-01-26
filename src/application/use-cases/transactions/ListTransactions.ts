import v from '@vinejs/vine'

import { ICountParams, ITransactionsRepository } from '@repositories/ITransactionsRepository'

import { ICategory, ITransaction, TransactionType, TransactionTypeEnum } from '@entities/index'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { optionalPromiseWrapper } from '@utils/functions'
import { createPaginationResult, IPagination } from '@utils/pagination'
import { lastDayOfMonth, startOfMonth } from 'date-fns'

type ListTransactionsRequest = {
	userId: string
	data: Partial<{
		page: number
		bankAccountId: string
		month: number
		year: number
		type: TransactionType
	}>
}
type ListTransactionsResponse = {
	transactions: Array<{
		category: ICategory | null
	} & ITransaction>
	pagination?: IPagination
}

type T = ListTransactionsRequest
type K = ListTransactionsResponse

export type IListTransactions = IWrappedUseCase<T, K>

export class ListTransactions implements IUseCase<T, K> {
	constructor(
		private readonly transactionsRepository: ITransactionsRepository
	) {}

	async execute({ userId, data }: T): Promise<K> {
		const { page, type, bankAccountId, month, year } = data

		const filters: ICountParams = {
			userId,
			type,
			bankAccountId
		}
		if (year !== undefined && month !== undefined) {
			const date = new Date(year, month)
			filters.date = {
				start: startOfMonth(date),
				end: lastDayOfMonth(date)
			}
		}

		const [transactions, pagination] = await Promise.all([
			this.transactionsRepository.findMany({ ...filters, page }),
			optionalPromiseWrapper(
				page === 1,
				() => createPaginationResult(this.transactionsRepository.count(filters))
			)
		])

		return { transactions, pagination }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			data: v.object({
				page: v.number().optional(),
				type: v.enum(TransactionTypeEnum).optional(),
				bankAccountId: v.string().optional(),
				month: v.number().optional(),
				year: v.number().optional()
			})
		})
		return await validator(schema, data)
	}
}