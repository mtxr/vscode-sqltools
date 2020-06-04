const reRegExpChar = /[\\^$.*+?()[\]{}|]/g
const reHasRegExpChar = RegExp(reRegExpChar.source)

/**
 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
 *
 * @since 3.0.0
 * @category String
 * @param {string} [str=''] The string to escape.
 * @returns {string} Returns the escaped string.
 */
function escapeRegExp(str?: string) {
  return (str && reHasRegExpChar.test(str))
    ? str.replace(reRegExpChar, '\\$&')
    : (str || '')
}

export default escapeRegExp
