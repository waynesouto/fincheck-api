import { BankAccountType } from '@entities/enums'

export type IBankAccount = {
	id: string
	userId: string
	name: string
	initialBalance: number
	type: BankAccountType
	color: string
	isActive: boolean
	createdAt: Date
	updatedAt: Date
}