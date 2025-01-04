export type IPagination = {
	pageSize: number
	totalPages: number
	totalCount: number
}

export const defaultPageSize = 25

export const paginate = (page?: number, size?: number) => {
	if (page === undefined || typeof page !== 'number') {
		return {
			limit: undefined,
			offset: undefined
		}
	}
	page = page - 1
	if (page < 0) page = 0

	if (size === undefined) size = defaultPageSize

	return {
		limit: size,
		offset: page * size
	}
}

export const createPaginationResult = async(
	counter: Promise<number>,
	pageSize: number = defaultPageSize
): Promise<IPagination> => {
	const count = await Promise.resolve(counter)
	return {
		pageSize,
		totalPages: Math.ceil(count / pageSize),
		totalCount: count
	}
}