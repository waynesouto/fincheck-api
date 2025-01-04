import { TransactionType } from '@entities/enums'

export type ITransaction = {
	id: string
	userId: string
	bankAccountId: string
	categoryId: string | null
	description: string
	value: number
	date: Date
	type: TransactionType
	createdAt: Date
	updatedAt: Date
}