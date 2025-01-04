import { eq, sql } from 'drizzle-orm'

import { IUser } from '@entities/IUser'
import { drizzle } from '@clients/drizzle'
import { users } from '@drizzle/schema'
import { ICreateParams, IFindFirstParams, IUpdateParams, IUsersRepository } from '@repositories/IUsersRepository'

export class DrizzleUsersRepository implements IUsersRepository {
	private findByIdQuery = drizzle.query.users.findFirst({
		where: eq(users.id, sql.placeholder('id'))
	}).prepare('findUserById')

	private findFirstQuery = drizzle.query.users.findFirst({
		where: eq(users.email, sql.placeholder('email'))
	}).prepare('findFirstUser')

	async create(data: ICreateParams): Promise<IUser> {
		return await drizzle
			.insert(users)
			.values(data)
			.returning()
			.then(([result]) => result)
	}

	async findById(id: string): Promise<IUser | null> {
		return await this.findByIdQuery.execute({ id }).then(result => result || null)
	}

	async findFirst({ email }: IFindFirstParams): Promise<IUser | null> {
		return await this.findFirstQuery.execute({ email }).then(result => result || null)
	}

	async update({ id, data }: IUpdateParams): Promise<IUser> {
		return await drizzle
			.update(users)
			.set(data)
			.where(eq(users.id, id))
			.returning()
			.then(([result]) => result)
	}
}