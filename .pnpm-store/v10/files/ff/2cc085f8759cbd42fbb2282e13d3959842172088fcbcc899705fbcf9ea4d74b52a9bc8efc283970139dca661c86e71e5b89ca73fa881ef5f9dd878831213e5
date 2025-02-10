import { __read, __spreadArray } from "tslib";
import { isArray, isNumber } from '@antv/util';
/**
 * @ignore
 * 是否是自动 padding
 * @param padding
 */
export function isAutoPadding(padding) {
    return !isNumber(padding) && !isArray(padding);
}
/**
 * @ignore
 * padding 的解析逻辑
 * @param padding
 * @return [ top, right, bottom, left ]
 */
export function parsePadding(padding) {
    if (padding === void 0) { padding = 0; }
    var paddingArray = isArray(padding) ? padding : [padding];
    switch (paddingArray.length) {
        case 0:
            paddingArray = [0, 0, 0, 0];
            break;
        case 1:
            paddingArray = new Array(4).fill(paddingArray[0]);
            break;
        case 2:
            paddingArray = __spreadArray(__spreadArray([], __read(paddingArray), false), __read(paddingArray), false);
            break;
        case 3:
            paddingArray = __spreadArray(__spreadArray([], __read(paddingArray), false), [paddingArray[1]], false);
            break;
        default:
            // 其他情况，只去四个
            paddingArray = paddingArray.slice(0, 4);
            break;
    }
    return paddingArray;
}
//# sourceMappingURL=padding.js.map