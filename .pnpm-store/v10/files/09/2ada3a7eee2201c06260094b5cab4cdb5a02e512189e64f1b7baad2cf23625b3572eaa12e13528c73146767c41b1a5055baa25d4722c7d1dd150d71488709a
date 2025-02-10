"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocale = exports.registerLocale = void 0;
var util_1 = require("@antv/util");
var utils_1 = require("../utils");
var global_1 = require("./global");
var LocaleMap = {};
/**
 * register a locale
 * @param locale
 * @param localeObj
 */
function registerLocale(locale, localeObj) {
    LocaleMap[locale] = localeObj;
}
exports.registerLocale = registerLocale;
/**
 * get locale of specific language
 * @param lang
 * @returns
 */
function getLocale(locale) {
    return {
        get: function (key, obj) {
            return (0, utils_1.template)((0, util_1.get)(LocaleMap[locale], key) || (0, util_1.get)(LocaleMap[global_1.GLOBAL.locale], key) || (0, util_1.get)(LocaleMap['en-US'], key) || key, obj);
        },
    };
}
exports.getLocale = getLocale;
//# sourceMappingURL=locale.js.map