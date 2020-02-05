export function asArray<T>(obj: any) {
  if (Array.isArray(obj)) {
    return obj as T[];
  }
  return Object.keys(obj).map((k) => obj[k]) as T[];
}
