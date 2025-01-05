import v from '@vinejs/vine'

import { IBankAccountsRepository } from '@repositories/IBankAccountsRepository'

import { BankAccountTypeEnum, IBankAccount } from '@entities/index'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { validateResourceOwnership } from '@utils/resource'

type UpdateBankAccountRequest = {
	userId: string
	id: string
	data: Partial<
		Pick<
			IBankAccount,
			| 'name'
			| 'color'
			| 'initialBalance'
			| 'isActive'
			| 'type'
		>>
}
type UpdateBankAccountResponse = {
	bankAccount: IBankAccount
}

type T = UpdateBankAccountRequest
type K = UpdateBankAccountResponse

export type IUpdateBankAccount = IWrappedUseCase<T, K>

export class UpdateBankAccount implements IUseCase<T, K> {
	constructor(
		private readonly bankAccountsRepository: IBankAccountsRepository
	) {}

	async execute({ userId, id, data }: T): Promise<K> {
		await this.bankAccountsRepository
			.findById(id)
			.then(bankAccount => validateResourceOwnership(bankAccount, userId, 'Bank account'))

		const bankAccount = await this.bankAccountsRepository.update({ id, data })

		return { bankAccount }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			id: v.string(),
			data: v.object({
				name: v.string().optional(),
				color: v.string().optional(),
				initialBalance: v.number().optional(),
				isActive: v.boolean().optional(),
				type: v.enum(BankAccountTypeEnum).optional()
			})
		})
		return await validator(schema, data)
	}
}