import bcrypt from 'bcryptjs'
import v from '@vinejs/vine'

import { IUsersRepository } from '@repositories/IUsersRepository'

import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { UnauthorizedException } from '@utils/exception'
import { validator } from '@utils/validator'

type LoginRequest = {
	email: string
	password: string
}
type LoginResponse = { user: { id: string } }

type T = LoginRequest
type K = LoginResponse

export type ILogin = IWrappedUseCase<T, K>

export class Login implements IUseCase<T, K> {
	constructor(
		private readonly usersRepository: IUsersRepository
	) {}

	async execute({ email, password }: T): Promise<K> {
		const user = await this.usersRepository.findFirst({ email })
		if (user === null) {
			throw new UnauthorizedException('Unauthorized login')
		}

		const passwordMatches = await bcrypt.compare(password, user.password)
		if (!passwordMatches) {
			throw new UnauthorizedException('Unauthorized login')
		}

		return { user: { id: user.id } }
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			email: v.string().email(),
			password: v.string().minLength(6)
		})
		return await validator(schema, data)
	}

}