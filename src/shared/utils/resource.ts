import { ForbiddenException, NotFoundException } from '@utils/exception'

/**
 * Validates the ownership of a resource by checking if the userId matches.
 *
 * @template T - The type of the resource which must include a userId property.
 * @param {T | null} value - The resource to be validated.
 * @param {string} userId - The ID of the user to be validated against the resource's userId.
 * @param {string} resourceName - The name of the resource, used in the error message if validation fails.
 * @returns {T} - The validated resource if the userId matches.
 * @throws {NotFoundException} - Throws an exception if the resource is not found or the userId does not match.
 * @throws {ForbiddenException} - Throws a forbidden exception if user is not owner of the resource
 */
export const validateResourceOwnership = <T extends { userId: string }>(
	value: T | null,
	userId: string,
	resourceName: string
): T => {
	if (value === null) {
		throw new NotFoundException(`${resourceName} not found`)
	}
	if (value.userId !== userId) {
		throw new ForbiddenException()
	}
	return value
}