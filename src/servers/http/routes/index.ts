import { FastifyInstance } from 'fastify'

import { authRoutes } from './auth-routes'
import { categoriesRoutes } from './category-routes'
import { usersRoutes } from './users-routes'
import { bankAccountsRoutes } from './bank-accounts-routes'
import { transactionsRoutes } from './transactions-routes'

export const routes = async(fastify: FastifyInstance) => {
	fastify.register(authRoutes)
	fastify.register(categoriesRoutes)
	fastify.register(usersRoutes)
	fastify.register(bankAccountsRoutes)
	fastify.register(transactionsRoutes)
}