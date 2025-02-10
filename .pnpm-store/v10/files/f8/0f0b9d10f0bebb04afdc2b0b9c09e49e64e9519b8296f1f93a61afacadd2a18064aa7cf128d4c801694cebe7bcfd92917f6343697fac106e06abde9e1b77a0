"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMean = exports.getMedian = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
/**
 * 获得中位数
 * @param array
 */
function getMedian(array) {
    var arr = tslib_1.__spreadArray([], tslib_1.__read(array), false);
    // 先排序
    arr.sort(function (a, b) {
        return a - b;
    });
    var len = arr.length;
    // median
    // 0
    if (len === 0) {
        return 0;
    }
    // 奇数
    if (len % 2 === 1) {
        return arr[(len - 1) / 2];
    }
    // 偶数
    return (arr[len / 2] + arr[len / 2 - 1]) / 2;
}
exports.getMedian = getMedian;
/**
 * 获得平均值
 * @param array
 */
function getMean(array) {
    var sum = (0, util_1.reduce)(array, function (r, num) {
        return (r += isNaN(num) || !(0, util_1.isNumber)(num) ? 0 : num);
    }, 0);
    return array.length === 0 ? 0 : sum / array.length;
}
exports.getMean = getMean;
//# sourceMappingURL=stat.js.map