"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kebabCase = void 0;
/**
 * @desc simple kebabCase like lodash
 *
 * kebabCase('fooBar'); => 'foo-bar'
 */
function kebabCase(word) {
    if (!word) {
        return word;
    }
    var result = word.match(/(([A-Z]{0,1}[a-z]*[^A-Z])|([A-Z]{1}))/g);
    return result.map(function (s) { return s.toLowerCase(); }).join('-');
}
exports.kebabCase = kebabCase;
//# sourceMappingURL=kebab-case.js.map