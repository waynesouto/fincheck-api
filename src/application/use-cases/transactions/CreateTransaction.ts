import v from '@vinejs/vine'

import { ITransactionsRepository } from '@repositories/ITransactionsRepository'
import { ICategoriesRepository } from '@repositories/ICategoriesRepository'
import { IBankAccountsRepository } from '@repositories/IBankAccountsRepository'

import { ITransaction, TransactionTypeEnum } from '@entities/index'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { CustomOmit } from '@utils/types'
import { optionalPromiseWrapper } from '@utils/functions'
import { validateResourceOwnership } from '@utils/resource'

type CreateTransactionRequest = {
	userId: string
	data: CustomOmit<ITransaction, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
}
type CreateTransactionResponse = {
	transaction: ITransaction
}

type T = CreateTransactionRequest
type K = CreateTransactionResponse

export type ICreateTransaction = IWrappedUseCase<T, K>

export class CreateTransaction implements IUseCase<T, K> {
	constructor(
		private readonly transactionsRepository: ITransactionsRepository,
		private readonly categoriesRepository: ICategoriesRepository,
		private readonly bankAccountsRepository: IBankAccountsRepository
	) {}

	async execute({ userId, data }: T): Promise<K> {
		// validate the foreign keys
		await this.validateForeignKeys(data, userId)

		const transaction = await this.transactionsRepository.create({
			...data,
			userId
		})

		return { transaction }
	}

	private async validateForeignKeys(data: T['data'], userId: string): Promise<void> {
		const { bankAccountId, categoryId } = data

		return Promise.all([
			this.bankAccountsRepository
				.findById(bankAccountId)
				.then(result => validateResourceOwnership(result, userId, 'Bank account')),
			optionalPromiseWrapper(
				categoryId !== null,
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
			data: v.object({
				bankAccountId: v.string(),
				categoryId: v.string().nullable(),
				value: v.number(),
				description: v.string(),
				type: v.enum(TransactionTypeEnum),
				date: v
					.date({ formats: { utc: true } })
					.parse(value => value || new Date().toISOString())
			})
		})
		return await validator(schema, data)
	}
}