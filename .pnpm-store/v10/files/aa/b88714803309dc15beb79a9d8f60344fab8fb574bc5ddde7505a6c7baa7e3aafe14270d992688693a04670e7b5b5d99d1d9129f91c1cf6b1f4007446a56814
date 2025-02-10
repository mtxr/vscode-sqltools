"use strict";
/**
 * Simplified from https://github.com/zertosh/invariant.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.invariant = exports.LEVEL = void 0;
var tslib_1 = require("tslib");
var LEVEL;
(function (LEVEL) {
    LEVEL["ERROR"] = "error";
    LEVEL["WARN"] = "warn";
    LEVEL["INFO"] = "log";
})(LEVEL = exports.LEVEL || (exports.LEVEL = {}));
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
function invariant(condition, format) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!condition) {
        var error = new Error(getMessage.apply(void 0, tslib_1.__spreadArray([format], args, false)));
        error.name = BRAND;
        // error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
    }
}
exports.invariant = invariant;
/**
 * 打印语句
 * @param level
 * @param condition
 * @param format
 * @param args
 */
function log(level, condition, format) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    if (!condition) {
        console[level](getMessage.apply(void 0, tslib_1.__spreadArray([format], args, false)));
    }
}
exports.log = log;
//# sourceMappingURL=invariant.js.map