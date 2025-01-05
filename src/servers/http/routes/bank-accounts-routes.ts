import { FastifyInstance } from 'fastify'

import { applyUseCase } from '@http/middlewares/apply-use-case'
import { sendResponse } from '@http/middlewares/send-response'

import { createBankAccount, deleteBankAccount, getOneBankAccount, listBankAccounts, updateBankAccount } from '@use-cases/bank-accounts'

export const bankAccountsRoutes = async(fastify: FastifyInstance) => {
	const options = { separateRequestData: true }
	const onRequest = [fastify.authenticate]

	fastify.post('/bank-accounts', { onRequest }, sendResponse(applyUseCase(createBankAccount, options)))

	fastify.get('/bank-accounts', { onRequest }, sendResponse(applyUseCase(listBankAccounts, options)))

	fastify.get('/bank-accounts/:id', { onRequest }, sendResponse(applyUseCase(getOneBankAccount, options)))

	fastify.patch('/bank-accounts/:id', { onRequest }, sendResponse(applyUseCase(updateBankAccount, options)))

	fastify.delete('/bank-accounts/:id', { onRequest }, sendResponse(applyUseCase(deleteBankAccount, options)))
}