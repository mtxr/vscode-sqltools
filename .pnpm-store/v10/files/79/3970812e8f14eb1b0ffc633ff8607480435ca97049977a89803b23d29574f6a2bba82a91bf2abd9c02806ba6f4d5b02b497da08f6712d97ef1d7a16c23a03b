export function constant(x) {
    return function () {
        return x;
    };
}
export function sumBy(arr, func) {
    var r = 0;
    for (var i = 0; i < arr.length; i++) {
        r += func(arr[i]);
    }
    return r;
}
/**
 * 计算最大值
 * @param arr
 * @param func
 */
export function maxValueBy(arr, func) {
    var r = -Infinity;
    for (var i = 0; i < arr.length; i++) {
        r = Math.max(func(arr[i]), r);
    }
    return r;
}
/**
 * 计算最小值
 * @param arr
 * @param func
 */
export function minValueBy(arr, func) {
    var r = Infinity;
    for (var i = 0; i < arr.length; i++) {
        r = Math.min(func(arr[i]), r);
    }
    return r;
}
//# sourceMappingURL=helper.js.map