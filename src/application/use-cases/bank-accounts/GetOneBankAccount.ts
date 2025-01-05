import v from '@vinejs/vine'

import { IBankAccountsRepository } from '@repositories/IBankAccountsRepository'

import { IBankAccount } from '@entities/IBankAccount'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { validateResourceOwnership } from '@utils/resource'

type GetOneBankAccountRequest = {
	userId: string
	id: string
}
type GetOneBankAccountResponse = {
	bankAccount: {
		currentBalance: number
		totalIncomes: number
		totalExpenses: number
	} & IBankAccount
}

type T = GetOneBankAccountRequest
type K = GetOneBankAccountResponse

export type IGetOneBankAccount = IWrappedUseCase<T, K>

export class GetOneBankAccount implements IUseCase<T, K> {
	constructor(
		private readonly bankAccountsRepository: IBankAccountsRepository
	) {}

	async execute({ userId, id }: T): Promise<K> {
		const bankAccount = await this.bankAccountsRepository
			.findByIdExtended(id)
			.then(bankAccount => validateResourceOwnership(bankAccount, userId, 'Bank account'))

		return { bankAccount }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			id: v.string()
		})
		return await validator(schema, data)
	}
}