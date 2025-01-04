import { boolean, doublePrecision, index, pgEnum, pgTable, PgTimestampConfig, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

import { randomID } from '@utils/random-id'

const timestampConfig: PgTimestampConfig = { precision: 3, mode: 'date' }

// Enums
export const bankAccountType = pgEnum('bank_account_type', ['checking', 'savings'])
export const transactionType = pgEnum('transaction_type', ['income', 'expense'])

// Tables
export const users = pgTable('users', {
	id: text().primaryKey().notNull().$defaultFn(() => randomID()),
	name: text().notNull(),
	email: text().unique().notNull(),
	password: text().notNull(),
	createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', timestampConfig).defaultNow().$onUpdate(() => new Date()).notNull()
}, ({ email }) => [uniqueIndex('users_email_key').using('btree', email)])

export const refreshTokens = pgTable('refresh_tokens', {
	id: text().primaryKey().notNull().$defaultFn(() => randomID()),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }).notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text().unique().notNull(),
	createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', timestampConfig).defaultNow().$onUpdate(() => new Date()).notNull()
}, ({ token, userId }) => [
	uniqueIndex('refresh_tokens_token_key').using('btree', token),
	index('refresh_tokens_user_id_key').using('btree', userId)
])

export const bankAccounts = pgTable('bank_accounts', {
	id: text().primaryKey().notNull().$defaultFn(() => randomID()),
	userId: text('user_id').references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' }).notNull(),
	name: text().notNull(),
	initialBalance: doublePrecision('initial_balance').default(0).notNull(),
	type: bankAccountType().notNull(),
	color: text().notNull(),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', timestampConfig).defaultNow().$onUpdate(() => new Date()).notNull()
}, ({ userId }) => [index('bank_accounts_user_id_key').using('btree', userId)])

export const categories = pgTable('categories', {
	id: text().primaryKey().notNull().$defaultFn(() => randomID()),
	userId: text('user_id').references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' }).notNull(),
	name: text().notNull(),
	icon: text().notNull(),
	type: transactionType().notNull(),
	createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', timestampConfig).defaultNow().$onUpdate(() => new Date()).notNull()
}, ({ userId }) => [index('categories_user_id_key').using('btree', userId)])

export const transactions = pgTable('transactions', {
	id: text().primaryKey().notNull().$defaultFn(() => randomID()),
	userId: text('user_id').references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' }).notNull(),
	bankAccountId: text('bank_account_id').references(() => bankAccounts.id, { onUpdate: 'cascade', onDelete: 'cascade' }).notNull(),
	categoryId: text('category_id').references(() => categories.id, { onUpdate: 'cascade', onDelete: 'set null' }),
	description: text().notNull(),
	value: doublePrecision().notNull(),
	date: timestamp(timestampConfig).notNull(),
	type: transactionType().notNull(),
	createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', timestampConfig).defaultNow().$onUpdate(() => new Date()).notNull()
}, ({ userId, bankAccountId, categoryId }) => [
	index('transactions_user_id_key').using('btree', userId),
	index('transactions_bank_account_id_key').using('btree', bankAccountId),
	index('transactions_category_id_key').using('btree', categoryId)
])