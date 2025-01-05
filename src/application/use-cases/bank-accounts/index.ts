import { DrizzleBankAccountsRepository } from '@repositories/implementations'

import { UseCaseHandler } from '@utils/use-case'

import { CreateBankAccount } from './CreateBankAccount'
import { DeleteBankAccount } from './DeleteBankAccount'
import { GetOneBankAccount } from './GetOneBankAccount'
import { ListBankAccounts } from './ListBankAccounts'
import { UpdateBankAccount } from './UpdateBankAccount'

export const createBankAccount = () => new UseCaseHandler(
	new CreateBankAccount(
		new DrizzleBankAccountsRepository()
	)
)

export const listBankAccounts = () => new UseCaseHandler(
	new ListBankAccounts(
		new DrizzleBankAccountsRepository()
	)
)

export const getOneBankAccount = () => new UseCaseHandler(
	new GetOneBankAccount(
		new DrizzleBankAccountsRepository()
	)
)

export const updateBankAccount = () => new UseCaseHandler(
	new UpdateBankAccount(
		new DrizzleBankAccountsRepository()
	)
)

export const deleteBankAccount = () => new UseCaseHandler(
	new DeleteBankAccount(
		new DrizzleBankAccountsRepository()
	)
)