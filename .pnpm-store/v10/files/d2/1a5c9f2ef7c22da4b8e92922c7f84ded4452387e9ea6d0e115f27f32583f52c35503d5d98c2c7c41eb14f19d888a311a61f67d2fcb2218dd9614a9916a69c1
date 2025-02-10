"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePadding = exports.isAutoPadding = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
/**
 * @ignore
 * 是否是自动 padding
 * @param padding
 */
function isAutoPadding(padding) {
    return !(0, util_1.isNumber)(padding) && !(0, util_1.isArray)(padding);
}
exports.isAutoPadding = isAutoPadding;
/**
 * @ignore
 * padding 的解析逻辑
 * @param padding
 * @return [ top, right, bottom, left ]
 */
function parsePadding(padding) {
    if (padding === void 0) { padding = 0; }
    var paddingArray = (0, util_1.isArray)(padding) ? padding : [padding];
    switch (paddingArray.length) {
        case 0:
            paddingArray = [0, 0, 0, 0];
            break;
        case 1:
            paddingArray = new Array(4).fill(paddingArray[0]);
            break;
        case 2:
            paddingArray = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(paddingArray), false), tslib_1.__read(paddingArray), false);
            break;
        case 3:
            paddingArray = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(paddingArray), false), [paddingArray[1]], false);
            break;
        default:
            // 其他情况，只去四个
            paddingArray = paddingArray.slice(0, 4);
            break;
    }
    return paddingArray;
}
exports.parsePadding = parsePadding;
//# sourceMappingURL=padding.js.map