import { FastifyInstance } from 'fastify'

import { applyUseCase } from '@http/middlewares/apply-use-case'
import { sendResponse } from '@http/middlewares/send-response'

import { createCategory, deleteCategory, getOneCategory, listCategories, updateCategory } from '@use-cases/categories'

export const categoriesRoutes = async(fastify: FastifyInstance) => {
	const options = { separateRequestData: true }
	const onRequest = [fastify.authenticate]

	fastify.post('/categories', { onRequest }, sendResponse(applyUseCase(createCategory, options)))

	fastify.get('/categories', { onRequest }, sendResponse(applyUseCase(listCategories, options)))

	fastify.get('/categories/:id', { onRequest }, sendResponse(applyUseCase(getOneCategory, options)))

	fastify.patch('/categories/:id', { onRequest }, sendResponse(applyUseCase(updateCategory, options)))

	fastify.delete('/categories/:id', { onRequest }, sendResponse(applyUseCase(deleteCategory, options)))
}