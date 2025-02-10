/**
 * @desc simple kebabCase like lodash
 *
 * kebabCase('fooBar'); => 'foo-bar'
 */
export function kebabCase(word) {
    if (!word) {
        return word;
    }
    var result = word.match(/(([A-Z]{0,1}[a-z]*[^A-Z])|([A-Z]{1}))/g);
    return result.map(function (s) { return s.toLowerCase(); }).join('-');
}
//# sourceMappingURL=kebab-case.js.map