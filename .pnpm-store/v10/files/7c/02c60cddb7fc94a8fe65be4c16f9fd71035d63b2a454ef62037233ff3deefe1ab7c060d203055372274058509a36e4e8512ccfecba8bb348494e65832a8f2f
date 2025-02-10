"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.precisionAdd = exports.getLogPositiveMin = exports.log = exports.calBase = void 0;
var util_1 = require("@antv/util");
// 求以a为次幂，结果为b的基数，如 x^^a = b;求x
// 虽然数学上 b 不支持负数，但是这里需要支持 负数
function calBase(a, b) {
    var e = Math.E;
    var value;
    if (b >= 0) {
        value = Math.pow(e, Math.log(b) / a); // 使用换底公式求底
    }
    else {
        value = Math.pow(e, Math.log(-b) / a) * -1; // 使用换底公式求底
    }
    return value;
}
exports.calBase = calBase;
function log(a, b) {
    if (a === 1) {
        return 1;
    }
    return Math.log(b) / Math.log(a);
}
exports.log = log;
function getLogPositiveMin(values, base, max) {
    if (util_1.isNil(max)) {
        max = Math.max.apply(null, values);
    }
    var positiveMin = max;
    util_1.each(values, function (value) {
        if (value > 0 && value < positiveMin) {
            positiveMin = value;
        }
    });
    if (positiveMin === max) {
        positiveMin = max / base;
    }
    if (positiveMin > 1) {
        positiveMin = 1;
    }
    return positiveMin;
}
exports.getLogPositiveMin = getLogPositiveMin;
function digitLength(num) {
    // Get digit length of e
    var eSplit = num.toString().split(/[eE]/);
    var len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
    return len > 0 ? len : 0;
}
/**
 * 高精度加法，解决 0.1 + 0.2 !== 0.3 的经典问题
 *
 * @param num1 加数
 * @param num2 被加数
 * @return {number} 返回值
 */
function precisionAdd(num1, num2) {
    var num1Digits = digitLength(num1);
    var num2Digits = digitLength(num2);
    var baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
}
exports.precisionAdd = precisionAdd;
//# sourceMappingURL=math.js.map