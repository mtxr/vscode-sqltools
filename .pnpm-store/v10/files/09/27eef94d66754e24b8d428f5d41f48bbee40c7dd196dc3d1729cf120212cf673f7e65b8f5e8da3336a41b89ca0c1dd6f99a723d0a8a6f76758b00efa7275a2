import { get } from '@antv/util';
import { template } from '../utils';
import { GLOBAL } from './global';
var LocaleMap = {};
/**
 * register a locale
 * @param locale
 * @param localeObj
 */
export function registerLocale(locale, localeObj) {
    LocaleMap[locale] = localeObj;
}
/**
 * get locale of specific language
 * @param lang
 * @returns
 */
export function getLocale(locale) {
    return {
        get: function (key, obj) {
            return template(get(LocaleMap[locale], key) || get(LocaleMap[GLOBAL.locale], key) || get(LocaleMap['en-US'], key) || key, obj);
        },
    };
}
//# sourceMappingURL=locale.js.map