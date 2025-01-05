import v from '@vinejs/vine'

import { IUsersRepository } from '@repositories/IUsersRepository'

import { IUser } from '@entities/IUser'

import { validator } from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { NotFoundException } from '@utils/exception'
import { CustomOmit } from '@utils/types'
import { omitKeys } from '@utils/functions'

type GetUserRequest = {
	userId: string
}
type GetUserResponse = {
	user: CustomOmit<IUser, 'password'>
}

type T = GetUserRequest
type K = GetUserResponse

export type IGetUser = IWrappedUseCase<T, K>

export class GetUser implements IUseCase<T, K> {
	constructor(
		private readonly usersRepository: IUsersRepository
	) {}

	async execute({ userId }: T): Promise<K> {
		const user = await this.usersRepository.findById(userId)
		if (user === null) {
			throw new NotFoundException('User not found')
		}

		return { user: omitKeys(user, ['password']) }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			userId: v.string()
		})
		return await validator(schema, data)
	}
}