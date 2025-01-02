export type IPagination = {
	page_size: number
	total_pages: number
	total_count: number
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
	page_size: number = defaultPageSize
): Promise<IPagination> => {
	const count = await Promise.resolve(counter)
	return {
		page_size,
		total_pages: Math.ceil(count / page_size),
		total_count: count
	}
}