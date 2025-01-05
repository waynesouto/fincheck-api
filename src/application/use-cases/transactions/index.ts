import { DrizzleBankAccountsRepository, DrizzleCategoriesRepository, DrizzleTransactionsRepository } from '@repositories/implementations'

import { UseCaseHandler } from '@utils/use-case'

import { CreateTransaction } from './CreateTransaction'
import { ListTransactions } from './ListTransactions'
import { GetOneTransaction } from './GetOneTransaction'
import { UpdateTransaction } from './UpdateTransaction'
import { DeleteTransaction } from './DeleteTransaction'

export const createTransaction = () => new UseCaseHandler(
	new CreateTransaction(
		new DrizzleTransactionsRepository(),
		new DrizzleCategoriesRepository(),
		new DrizzleBankAccountsRepository()
	)
)

export const listTransactions = () => new UseCaseHandler(
	new ListTransactions(
		new DrizzleTransactionsRepository()
	)
)

export const getOneTransaction = () => new UseCaseHandler(
	new GetOneTransaction(
		new DrizzleTransactionsRepository()
	)
)

export const updateTransaction = () => new UseCaseHandler(
	new UpdateTransaction(
		new DrizzleTransactionsRepository(),
		new DrizzleCategoriesRepository(),
		new DrizzleBankAccountsRepository()
	)
)

export const deleteTransaction = () => new UseCaseHandler(
	new DeleteTransaction(
		new DrizzleTransactionsRepository()
	)
)