/** A typical comparator for sorting object keys */
type KeyComparator = (a: string, b: string) => number;
/** An indexable object */
type IndexedObject = {
    [key: string]: any;
};
/**
 * Returns a copy of the passed array, with all nested objects within it sorted deeply by their keys, without mangling any nested arrays.
 * @param subject The unsorted array.
 * @param comparator An optional comparator for sorting keys of objects.
 * @returns The new sorted array.
 */
export declare function sortArray<T extends any[]>(subject: T, comparator?: KeyComparator): T;
/**
 * Returns a copy of the passed object, with all nested objects within it sorted deeply by their keys, without mangling any nested arrays inside of it.
 * @param subject The unsorted object.
 * @param comparator An optional comparator for sorting keys of objects.
 * @returns The new sorted object.
 */
export default function sortObject<T extends IndexedObject>(subject: T, comparator?: KeyComparator): T;
export {};
//# sourceMappingURL=index.d.ts.map