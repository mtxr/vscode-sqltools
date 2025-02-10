"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minValueBy = exports.maxValueBy = exports.sumBy = exports.constant = void 0;
function constant(x) {
    return function () {
        return x;
    };
}
exports.constant = constant;
function sumBy(arr, func) {
    var r = 0;
    for (var i = 0; i < arr.length; i++) {
        r += func(arr[i]);
    }
    return r;
}
exports.sumBy = sumBy;
/**
 * 计算最大值
 * @param arr
 * @param func
 */
function maxValueBy(arr, func) {
    var r = -Infinity;
    for (var i = 0; i < arr.length; i++) {
        r = Math.max(func(arr[i]), r);
    }
    return r;
}
exports.maxValueBy = maxValueBy;
/**
 * 计算最小值
 * @param arr
 * @param func
 */
function minValueBy(arr, func) {
    var r = Infinity;
    for (var i = 0; i < arr.length; i++) {
        r = Math.min(func(arr[i]), r);
    }
    return r;
}
exports.minValueBy = minValueBy;
//# sourceMappingURL=helper.js.map