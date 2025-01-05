import v from '@vinejs/vine'

import { ITransactionsRepository } from '@repositories/ITransactionsRepository'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { EmptyObject } from '@utils/types'
import { validateResourceOwnership } from '@utils/resource'

type DeleteTransactionRequest = {
	userId: string
	id: string
}
type DeleteTransactionResponse = EmptyObject

type T = DeleteTransactionRequest
type K = DeleteTransactionResponse

export type IDeleteTransaction = IWrappedUseCase<T, K>

export class DeleteTransaction implements IUseCase<T, K> {
	constructor(
		private readonly transactionsRepository: ITransactionsRepository
	) {}

	async execute({ userId, id }: T): Promise<K> {
		const transaction = await this.transactionsRepository.findById(id)
		validateResourceOwnership(transaction, userId, 'Transaction')

		await this.transactionsRepository.delete(id)

		return {}
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			id: v.string()
		})
		return await validator(schema, data)
	}
}