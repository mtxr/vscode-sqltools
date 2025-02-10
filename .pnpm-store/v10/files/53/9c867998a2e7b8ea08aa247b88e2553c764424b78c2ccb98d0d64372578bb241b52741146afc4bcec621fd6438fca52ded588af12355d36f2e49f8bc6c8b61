export default function toList(candidate) {
  let skipEmpty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (skipEmpty && (candidate === undefined || candidate === null)) return [];
  return Array.isArray(candidate) ? candidate : [candidate];
}