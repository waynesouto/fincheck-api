import { FastifyInstance } from 'fastify'

import { applyUseCase } from '@http/middlewares/apply-use-case'
import { sendResponse } from '@http/middlewares/send-response'

import { createTransaction, deleteTransaction, getOneTransaction, listTransactions, updateTransaction } from '@use-cases/transactions'

export const transactionsRoutes = async(fastify: FastifyInstance) => {
	const options = { separateRequestData: true }
	const onRequest = [fastify.authenticate]

	fastify.post('/transactions', { onRequest }, sendResponse(applyUseCase(createTransaction, options)))

	fastify.get('/transactions', { onRequest }, sendResponse(applyUseCase(listTransactions, options)))

	fastify.get('/transactions/:id', { onRequest }, sendResponse(applyUseCase(getOneTransaction, options)))

	fastify.patch('/transactions/:id', { onRequest }, sendResponse(applyUseCase(updateTransaction, options)))

	fastify.delete('/transactions/:id', { onRequest }, sendResponse(applyUseCase(deleteTransaction, options)))
}