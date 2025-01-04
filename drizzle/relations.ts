import { relations } from 'drizzle-orm'

import * as schema from './schema'

export const usersRelations = relations(schema.users, ({ many }) => ({
	bankAccounts: many(schema.bankAccounts),
	categories: many(schema.categories),
	transactions: many(schema.transactions),
	refreshTokens: many(schema.refreshTokens)
}))

export const bankAccountsRelations = relations(schema.bankAccounts, ({ many, one }) => ({
	transactions: many(schema.transactions),
	user: one(schema.users, {
		fields: [schema.bankAccounts.userId],
		references: [schema.users.id]
	})
}))

export const categoriesRelations = relations(schema.categories, ({ one, many }) => ({
	transactions: many(schema.transactions),
	user: one(schema.users, {
		fields: [schema.categories.userId],
		references: [schema.users.id]
	})
}))

export const transactionsRelations = relations(schema.transactions, ({  one }) => ({
	user: one(schema.users, {
		fields: [schema.transactions.userId],
		references: [schema.users.id]
	}),
	bankAccount: one(schema.bankAccounts, {
		fields: [schema.transactions.bankAccountId],
		references: [schema.bankAccounts.id]
	}),
	category: one(schema.categories, {
		fields: [schema.transactions.categoryId],
		references: [schema.categories.id]
	})
}))