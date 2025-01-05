import v from '@vinejs/vine'

import { ITransactionsRepository } from '@repositories/ITransactionsRepository'

import { ITransaction } from '@entities/ITransaction'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { validateResourceOwnership } from '@utils/resource'

type GetOneTransactionRequest = {
	userId: string
	id: string
}
type GetOneTransactionResponse = {
	transaction: ITransaction
}

type T = GetOneTransactionRequest
type K = GetOneTransactionResponse

export type IGetOneTransaction = IWrappedUseCase<T, K>

export class GetOneTransaction implements IUseCase<T, K> {
	constructor(
		private readonly transactionsRepository: ITransactionsRepository
	) {}

	async execute({ userId, id }: T): Promise<K> {
		const transaction = await this.transactionsRepository
			.findById(id)
			.then(transaction => validateResourceOwnership(transaction, userId, 'Transaction'))

		return { transaction }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			id: v.string()
		})
		return await validator(schema, data)
	}
}