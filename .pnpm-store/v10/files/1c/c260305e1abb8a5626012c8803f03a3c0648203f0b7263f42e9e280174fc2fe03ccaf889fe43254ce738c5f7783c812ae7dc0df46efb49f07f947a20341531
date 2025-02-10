import { __read, __spreadArray } from "tslib";
import { reduce, isNumber } from '@antv/util';
/**
 * 获得中位数
 * @param array
 */
export function getMedian(array) {
    var arr = __spreadArray([], __read(array), false);
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
/**
 * 获得平均值
 * @param array
 */
export function getMean(array) {
    var sum = reduce(array, function (r, num) {
        return (r += isNaN(num) || !isNumber(num) ? 0 : num);
    }, 0);
    return array.length === 0 ? 0 : sum / array.length;
}
//# sourceMappingURL=stat.js.map