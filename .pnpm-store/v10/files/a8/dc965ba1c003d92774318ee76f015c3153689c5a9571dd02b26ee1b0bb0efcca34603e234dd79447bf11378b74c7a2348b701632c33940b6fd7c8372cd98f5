"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMappingValue = void 0;
var tslib_1 = require("tslib");
/**
 * @ignore
 * get the mapping value by attribute, if mapping value is nil, return def
 * @param attr
 * @param value
 * @param def
 * @returns get mapping value
 */
function getMappingValue(attr, value, def) {
    if (!attr) {
        return def;
    }
    var r;
    // 多参数映射，阻止程序报错
    if (attr.callback && attr.callback.length > 1) {
        var restArgs = Array(attr.callback.length - 1).fill('');
        r = attr.mapping.apply(attr, tslib_1.__spreadArray([value], tslib_1.__read(restArgs), false)).join('');
    }
    else {
        r = attr.mapping(value).join('');
    }
    return r || def;
}
exports.getMappingValue = getMappingValue;
//# sourceMappingURL=attr.js.map