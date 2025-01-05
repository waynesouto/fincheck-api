import v from '@vinejs/vine'
import bcrypt from 'bcryptjs'

import { IUser } from '@entities/IUser'

import { IUsersRepository } from '@repositories/IUsersRepository'
import { ICategoriesRepository } from '@repositories/ICategoriesRepository'

import { IUseCase, IWrappedUseCase } from '@utils/use-case'
import { ConflictException } from '@utils/exception'
import { validator } from '@utils/validator'

type RegisterRequest = Pick<IUser, 'name' | 'email' | 'password'>
type RegisterResponse = { user: { id: string } }

type T = RegisterRequest
type K = RegisterResponse

export type IRegister = IWrappedUseCase<T, K>

export class Register implements IUseCase<T, K> {
	constructor(
		private readonly usersRepository: IUsersRepository,
		private readonly categoriesRepository: ICategoriesRepository
	) {}

	async execute({ email, password, ...data }: T): Promise<K> {
		const emailTaken = await this.usersRepository.findFirst({ email })
		if (emailTaken !== null) {
			throw new ConflictException('Email already in use')
		}

		const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(10))
		const { id } = await this.usersRepository.create({
			...data,
			email,
			password: passwordHash
		})

		setImmediate(() => {
			// create default categories for user
			this.createDefaultCategories(id)
		})

		return { user: { id } }
	}

	private createDefaultCategories(userId: string) {
		this.categoriesRepository.createMany([
			// Income
			{ name: 'Salário', icon: 'salary', type: 'income', userId },
			{ name: 'Freelance', icon: 'freelance', type: 'income', userId },
			{ name: 'Outro', icon: 'other', type: 'income', userId },
			// Expense
			{ name: 'Casa', icon: 'home', type: 'expense', userId },
			{ name: 'Alimentação', icon: 'food', type: 'expense', userId },
			{ name: 'Educação', icon: 'education', type: 'expense', userId },
			{ name: 'Lazer', icon: 'fun', type: 'expense', userId },
			{ name: 'Mercado', icon: 'grocery', type: 'expense', userId },
			{ name: 'Roupas', icon: 'clothes', type: 'expense', userId },
			{ name: 'Transporte', icon: 'transport', type: 'expense', userId },
			{ name: 'Viagem', icon: 'travel', type: 'expense', userId },
			{ name: 'Outro', icon: 'other', type: 'expense', userId }
		])
	}

	async validate(data: T): Promise<T> {
		const schema = v.object({
			email: v.string().email(),
			name: v.string(),
			password: v.string().minLength(6).maxLength(255)
		})
		return await validator(schema, data)
	}
}