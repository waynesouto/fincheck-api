export enum TransactionTypeEnum {
	income = 'income',
	expense = 'expense'
}

export type TransactionType = keyof typeof TransactionTypeEnum