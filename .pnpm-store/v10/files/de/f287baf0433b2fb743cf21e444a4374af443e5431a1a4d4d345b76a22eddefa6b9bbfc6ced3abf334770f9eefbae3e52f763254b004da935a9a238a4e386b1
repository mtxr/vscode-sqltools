"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiply = exports.gauss = void 0;
/**
 * Gaussian elimination
 * @param  array a matrix
 * @return array x solution vector
 */
function gauss(a) {
    var row = a.length;
    var col = a[0].length;
    var m = row; // 方程的个数
    var n = col - 1; // 变量的个数(最后一列是常量)
    /**
     * 先对 a 进行排序，排序规则为：
     * - 第 i 列对应从 i 行到最后一行的最大值，放到当前行
     */
    for (var i = 0; i < n; i++) {
        // 1. 找到这一列的最大值、已经行索引
        var max = Number.MIN_SAFE_INTEGER;
        var maxRow = void 0;
        // 找到这一列的最大值、已经行索引
        for (var j = i; j < m; j++) {
            if (Math.abs(a[j][i]) > max) {
                max = Math.abs(a[j][i]);
                maxRow = j;
            }
        }
        // 2. 找到这一列的最大值之后，交换行
        var tmp = a[maxRow];
        a[maxRow] = a[i];
        a[i] = tmp;
        // 3. 这一行下面，在这一列上的数据全部为 0
        for (var j = i + 1; j < m; j++) {
            // 配平系数
            var c = -a[j][i] / a[i][i];
            // 这一行的元素全部处理
            for (var k = i; k < n + 1; k++) {
                a[j][k] += c * a[i][k];
            }
        }
    }
    /**
     * 反向迭代，计算变量值
     */
    var b = new Array(n).fill(0);
    // 只有 n 个变量（n 后的方程直接忽略）
    for (var i = n - 1; i >= 0; i--) {
        b[i] = a[i][n] / a[i][i];
        // 向上带入归零
        for (var j = i - 1; j >= 0; j--) {
            var c = -a[j][i] / a[i][i];
            a[j][i] += a[i][i] * c;
            a[j][n] += a[i][n] * c;
        }
    }
    return b;
}
exports.gauss = gauss;
/**
 * 乘法
 * @param v
 */
function multiply(v) {
    return v.reduce(function (r, c) { return r * c; }, 1);
}
exports.multiply = multiply;
//# sourceMappingURL=gauss.js.map