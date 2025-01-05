import v from '@vinejs/vine'

import { ITransactionsRepository } from '@repositories/ITransactionsRepository'
import { ICategoriesRepository } from '@repositories/ICategoriesRepository'
import { IBankAccountsRepository } from '@repositories/IBankAccountsRepository'

import { ITransaction, TransactionTypeEnum } from '@entities/index'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { validateResourceOwnership } from '@utils/resource'
import { optionalPromiseWrapper } from '@utils/functions'

type UpdateTransactionRequest = {
	userId: string
	id: string
	data: Partial<
		Pick<
			ITransaction,
			| 'bankAccountId'
			| 'categoryId'
			| 'description'
			| 'date'
			| 'type'
			| 'value'
		>>
}
type UpdateTransactionResponse = {
	transaction: ITransaction
}

type T = UpdateTransactionRequest
type K = UpdateTransactionResponse

export type IUpdateTransaction = IWrappedUseCase<T, K>

export class UpdateTransaction implements IUseCase<T, K> {
	constructor(
		private readonly transactionsRepository: ITransactionsRepository,
		private readonly categoriesRepository: ICategoriesRepository,
		private readonly bankAccountsRepository: IBankAccountsRepository
	) {}

	async execute({ userId, id, data }: T): Promise<K> {
		const transactionExists = await this.transactionsRepository
			.findById(id)
			.then(transaction => validateResourceOwnership(transaction, userId, 'Transaction'))

		// validate the foreign keys
		await this.validateForeignKeys(data, userId, transactionExists)

		const transaction = await this.transactionsRepository.update({ id, data })

		return { transaction }
	}

	private async validateForeignKeys(
		data: T['data'],
		userId: string,
		transaction: ITransaction
	): Promise<void> {
		const { bankAccountId, categoryId } = data

		return Promise.all([
			optionalPromiseWrapper(
				bankAccountId != null && transaction.bankAccountId !== bankAccountId,
				() => this.bankAccountsRepository
					.findById(bankAccountId as string)
					.then(result => validateResourceOwnership(result, userId, 'Bank account'))
			),
			optionalPromiseWrapper(
				categoryId != null && transaction.categoryId !== categoryId,
				() => this.categoriesRepository
					.findById(categoryId as string)
					.then(result => validateResourceOwnership(result, userId, 'Category'))
			)
		]).then(() => {}).catch(e => {
			throw e
		})
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			id: v.string(),
			data: v.object({
				bankAccountId: v.string().optional(),
				categoryId: v.string().nullable().optional(),
				description: v.string().optional(),
				date: v
					.date({ formats: { utc: true } })
					.parse(value => value || new Date().toISOString()).optional(),
				type: v.enum(TransactionTypeEnum).optional(),
				value: v.number().optional()
			})
		})
		return await validator(schema, data)
	}
}