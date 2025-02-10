/**
 * Simplified from https://github.com/zertosh/invariant.
 */
import { __spreadArray } from "tslib";
export var LEVEL;
(function (LEVEL) {
    LEVEL["ERROR"] = "error";
    LEVEL["WARN"] = "warn";
    LEVEL["INFO"] = "log";
})(LEVEL || (LEVEL = {}));
var BRAND = 'AntV/G2Plot';
/**
 * 获取错误消息
 * @param format
 * @param args
 */
function getMessage(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var argIndex = 0;
    return "".concat(BRAND, ": ").concat(format.replace(/%s/g, function () { return "".concat(args[argIndex++]); }));
}
/**
 * invariant error
 * @param condition
 * @param format
 * @param args
 */
export function invariant(condition, format) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!condition) {
        var error = new Error(getMessage.apply(void 0, __spreadArray([format], args, false)));
        error.name = BRAND;
        // error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
    }
}
/**
 * 打印语句
 * @param level
 * @param condition
 * @param format
 * @param args
 */
export function log(level, condition, format) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    if (!condition) {
        console[level](getMessage.apply(void 0, __spreadArray([format], args, false)));
    }
}
//# sourceMappingURL=invariant.js.map