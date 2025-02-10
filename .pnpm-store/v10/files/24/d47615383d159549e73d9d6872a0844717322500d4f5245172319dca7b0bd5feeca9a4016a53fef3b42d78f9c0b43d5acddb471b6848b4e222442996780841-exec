/** A typical comparator for sorting object keys */
type KeyComparator = (a: string, b: string) => number

/** An indexable object */
type IndexedObject = { [key: string]: any }

/**
 * Returns a copy of the passed array, with all nested objects within it sorted deeply by their keys, without mangling any nested arrays.
 * @param subject The unsorted array.
 * @param comparator An optional comparator for sorting keys of objects.
 * @returns The new sorted array.
 */
export function sortArray<T extends any[]>(
	subject: T,
	comparator?: KeyComparator,
): T {
	const result = []
	for (let value of subject) {
		// Recurse if object or array
		if (value != null) {
			if (Array.isArray(value)) {
				value = sortArray(value, comparator)
			} else if (typeof value === 'object') {
				/* eslint no-use-before-define:0 */
				value = sortObject(value, comparator)
			}
		}

		// Push
		result.push(value)
	}
	return result as T
}

/**
 * Returns a copy of the passed object, with all nested objects within it sorted deeply by their keys, without mangling any nested arrays inside of it.
 * @param subject The unsorted object.
 * @param comparator An optional comparator for sorting keys of objects.
 * @returns The new sorted object.
 */
export default function sortObject<T extends IndexedObject>(
	subject: T,
	comparator?: KeyComparator,
): T {
	const result: IndexedObject = {} as T
	const sortedKeys = Object.keys(subject).sort(comparator)
	for (let i = 0; i < sortedKeys.length; ++i) {
		// Fetch
		const key = sortedKeys[i]
		let value = subject[key]

		// Recurse if object or array
		if (value != null) {
			if (Array.isArray(value)) {
				value = sortArray(value, comparator)
			} else if (typeof value === 'object') {
				value = sortObject(value, comparator)
			}
		}

		// Push
		result[key] = value
	}
	return result as T
}
