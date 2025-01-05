import v from '@vinejs/vine'

import { IBankAccountsRepository } from '@repositories/IBankAccountsRepository'

import { BankAccountTypeEnum, IBankAccount } from '@entities/index'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'

type CreateBankAccountRequest = {
	userId: string
	data: Pick<IBankAccount, 'name' | 'type' | 'color' | 'initialBalance'>
}
type CreateBankAccountResponse = {
	bankAccount: IBankAccount
}

type T = CreateBankAccountRequest
type K = CreateBankAccountResponse

export type ICreateBankAccount = IWrappedUseCase<T, K>

export class CreateBankAccount implements IUseCase<T, K> {
	constructor(
		private readonly bankAccountsRepository: IBankAccountsRepository
	) {}

	async execute({ userId, data }: T): Promise<K> {
		const bankAccount = await this.bankAccountsRepository.create({
			...data,
			userId,
			isActive: true
		})

		return { bankAccount }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			data: v.object({
				name: v.string(),
				type: v.enum(BankAccountTypeEnum),
				color: v.string(),
				initialBalance: v.number()
			})
		})
		return await validator(schema, data)
	}
}