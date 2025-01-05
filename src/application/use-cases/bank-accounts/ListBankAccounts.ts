import v from '@vinejs/vine'

import { IBankAccountsRepository, ICountParams } from '@repositories/IBankAccountsRepository'

import { BankAccountType, BankAccountTypeEnum, IBankAccount } from '@entities/index'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { createPaginationResult, IPagination } from '@utils/pagination'
import { optionalPromiseWrapper } from '@utils/functions'

type ListBankAccountsRequest = {
	userId: string
	data: Partial<{
		page: number
		type: BankAccountType
	}>
}
type ListBankAccountsResponse = {
	bankAccounts: Array<{
		currentBalance: number
	} & IBankAccount>
	pagination?: IPagination
}

type T = ListBankAccountsRequest
type K = ListBankAccountsResponse

type IListBankAccounts = IWrappedUseCase<T, K>

class ListBankAccounts implements IUseCase<T, K> {
	constructor(
		private readonly bankAccountsRepository: IBankAccountsRepository
	) {}

	async execute({ userId, data }: T): Promise<K> {
		const { page, type } = data
		const filters: ICountParams = {
			userId,
			type
		}

		const [bankAccounts, pagination] = await Promise.all([
			this.bankAccountsRepository.findMany({ ...filters, page }),
			optionalPromiseWrapper(
				page === 1,
				() => createPaginationResult(this.bankAccountsRepository.count(filters))
			)
		])

		return { bankAccounts, pagination }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string(),
			data: v.object({
				page: v.number().optional(),
				type: v.enum(BankAccountTypeEnum).optional()
			})
		})
		return await validator(schema, data)
	}
}

export { IListBankAccounts, ListBankAccounts }