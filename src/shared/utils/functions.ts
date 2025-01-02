/**
 * Wraps a promise in an optional manner based on a condition.
 * If the condition is true, the promise is returned.
 * If the condition is false, a resolved promise is returned.
 * @param condition - The condition to determine whether to return the promise or a resolved promise.
 * @param promise - The promise to be wrapped.
 * @returns A promise that resolves to the original promise if the condition is true, or a resolved promise if the condition is false.
 */
export const optionalPromiseWrapper = <T>(
	condition: boolean,
	promise: () => Promise<T>
): Promise<T | undefined> => {
	return condition ? promise() : Promise.resolve(undefined)
}

/**
 * Removes all non-numeric characters from a given text.
 *
 * @param text - The input text.
 * @returns The text with non-numeric characters removed.
 */
export const removeNonNumericChars = (text: string): string => {
	return text.replace(/\D/g, '')
}