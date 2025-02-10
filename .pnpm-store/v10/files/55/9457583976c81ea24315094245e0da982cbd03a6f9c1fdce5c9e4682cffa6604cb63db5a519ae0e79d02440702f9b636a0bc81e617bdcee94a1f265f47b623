"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniq = exports.omit = exports.padEnd = exports.isBetween = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
/**
 * @ignore
 * Determines whether between is
 * @param value
 * @param start
 * @param end
 * @returns true if between
 */
function isBetween(value, start, end) {
    var min = Math.min(start, end);
    var max = Math.max(start, end);
    return value >= min && value <= max;
}
exports.isBetween = isBetween;
/**
 * @ignore
 * pads the current string/array with a given value (repeated, if needed) so that the resulting reaches a given length.
 * The padding is applied from the end of the current value.
 *
 * @param source
 * @param targetLength
 * @param padValue
 * @returns
 */
function padEnd(source, targetLength, padValue) {
    if ((0, util_1.isString)(source)) {
        return source.padEnd(targetLength, padValue);
    }
    else if ((0, util_1.isArray)(source)) {
        var sourceLength = source.length;
        if (sourceLength < targetLength) {
            var diff = targetLength - sourceLength;
            for (var i = 0; i < diff; i++) {
                source.push(padValue);
            }
        }
    }
    return source;
}
exports.padEnd = padEnd;
/**
 * @ignore
 * omit keys of an object.
 * @param obj
 * @param keys
 */
function omit(obj, keys) {
    if (typeof obj === 'object') {
        keys.forEach(function (key) {
            delete obj[key];
        });
    }
    return obj;
}
exports.omit = omit;
/**
 * @ignore
 * @param sourceArray
 * @param targetArray
 * @param map
 */
function uniq(sourceArray, targetArray, map) {
    var e_1, _a;
    if (targetArray === void 0) { targetArray = []; }
    if (map === void 0) { map = new Map(); }
    try {
        for (var sourceArray_1 = tslib_1.__values(sourceArray), sourceArray_1_1 = sourceArray_1.next(); !sourceArray_1_1.done; sourceArray_1_1 = sourceArray_1.next()) {
            var source = sourceArray_1_1.value;
            if (!map.has(source)) {
                targetArray.push(source);
                map.set(source, true);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (sourceArray_1_1 && !sourceArray_1_1.done && (_a = sourceArray_1.return)) _a.call(sourceArray_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return targetArray;
}
exports.uniq = uniq;
//# sourceMappingURL=helper.js.map