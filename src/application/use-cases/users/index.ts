import { DrizzleUsersRepository } from '@repositories/implementations'

import { UseCaseHandler } from '@utils/use-case'

import { GetUser } from './GetUser'

export const getUser = () => new UseCaseHandler(
	new GetUser(
		new DrizzleUsersRepository()
	)
)