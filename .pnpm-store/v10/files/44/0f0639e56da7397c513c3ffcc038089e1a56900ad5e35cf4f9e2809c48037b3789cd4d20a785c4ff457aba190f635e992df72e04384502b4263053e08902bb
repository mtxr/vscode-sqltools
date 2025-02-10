"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
/**
 * 二分右侧查找
 * https://github.com/d3/d3-array/blob/master/src/bisector.js
 */
function default_1(getter) {
    /**
     * x: 目标值
     * lo: 起始位置
     * hi: 结束位置
     */
    return function (a, x, _lo, _hi) {
        var lo = util_1.isNil(_lo) ? 0 : _lo;
        var hi = util_1.isNil(_hi) ? a.length : _hi;
        while (lo < hi) {
            var mid = (lo + hi) >>> 1;
            if (getter(a[mid]) > x) {
                hi = mid;
            }
            else {
                lo = mid + 1;
            }
        }
        return lo;
    };
}
exports.default = default_1;
//# sourceMappingURL=bisector.js.map