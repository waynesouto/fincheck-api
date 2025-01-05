import v from '@vinejs/vine'

import { IBankAccountsRepository } from '@repositories/IBankAccountsRepository'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { EmptyObject } from '@utils/types'
import { validateResourceOwnership } from '@utils/resource'

type DeleteBankAccountRequest = {
	userId: string
	id: string
}
type DeleteBankAccountResponse = EmptyObject

type T = DeleteBankAccountRequest
type K = DeleteBankAccountResponse

export type IDeleteBankAccount = IWrappedUseCase<T, K>

export class DeleteBankAccount implements IUseCase<T, K> {
	constructor(
		private readonly bankAccountsRepository: IBankAccountsRepository
	) {}

	async execute({ id, userId }: T): Promise<K> {
		await this.bankAccountsRepository
			.findById(id)
			.then(bankAccount => validateResourceOwnership(bankAccount, userId, 'Bank account'))

		await this.bankAccountsRepository.delete(id)

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