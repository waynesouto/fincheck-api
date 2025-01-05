import { UseCaseHandler } from '@utils/use-case'

import { DrizzleCategoriesRepository, DrizzleRefreshTokensRepository, DrizzleUsersRepository } from '@repositories/implementations'

import { Register } from './Register'
import { Login } from './Login'
import { Logout } from './Logout'
import { GenerateAccessToken } from './GenerateAccessToken'

export const register = () => new UseCaseHandler(
	new Register(
		new DrizzleUsersRepository(),
		new DrizzleCategoriesRepository()
	)
)

export const login = () => new UseCaseHandler(
	new Login(
		new DrizzleUsersRepository()
	)
)

export const generateAccessToken = () => new UseCaseHandler(
	new GenerateAccessToken(
		new DrizzleRefreshTokensRepository()
	)
)

export const logout = () => new UseCaseHandler(
	new Logout(
		new DrizzleRefreshTokensRepository()
	)
)