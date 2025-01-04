export enum BankAccountTypeEnum {
	checking = 'checking',
	savings = 'savings'
}

export type BankAccountType = keyof typeof BankAccountTypeEnum