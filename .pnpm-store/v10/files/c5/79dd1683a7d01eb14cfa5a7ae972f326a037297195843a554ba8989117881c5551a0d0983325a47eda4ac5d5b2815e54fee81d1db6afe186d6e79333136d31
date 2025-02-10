import { __read, __spreadArray } from "tslib";
import { uniq } from '@antv/util';
import { gauss } from './gauss';
/**
 * 约束布局构建和计算，目前针对 G2 的场景：
 * - 一定都是等式
 * - 一定有解
 * 所以将算法退化成多元一次方程组的解法，直接使用高斯消元法（o(n^2)）
 */
var Solver = /** @class */ (function () {
    function Solver() {
        /**
         * 存在的约束
         */
        this.constraints = [];
        this.variables = [];
    }
    /**
     * 添加多条约束
     * @param constraint
     */
    Solver.prototype.addConstraint = function () {
        var _a;
        var constraints = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            constraints[_i] = arguments[_i];
        }
        (_a = this.constraints).push.apply(_a, __spreadArray([], __read(constraints), false));
    };
    /**
     * 计算返回布局
     */
    Solver.prototype.calc = function () {
        // 1. 拿到变量
        this.variables = this.getVariables();
        this.m = this.constraints.length;
        this.n = this.variables.length;
        // 2. 获取消元矩阵
        var matrix = this.getGaussMatrix();
        // 3. 求解
        var result = gauss(matrix);
        this.variables.forEach(function (v, idx) {
            v.value = result[idx];
        });
        return this.variables;
    };
    /**
     * 获取约束中所有的变量
     */
    Solver.prototype.getVariables = function () {
        var vars = [];
        for (var i = 0; i < this.constraints.length; i++) {
            var constraint = this.constraints[i];
            vars = vars.concat(constraint.getVariables());
        }
        return uniq(vars);
    };
    /**
     * 获得高斯消元的矩阵
     */
    Solver.prototype.getGaussMatrix = function () {
        var variableMap = new Map();
        for (var i = 0; i < this.n; i++) {
            var variable = this.variables[i];
            variableMap.set(variable, i);
        }
        var matrix = [];
        for (var i = 0; i < this.m; i++) {
            var constraint = this.constraints[i];
            var arr = constraint.getGaussArr(variableMap);
            matrix.push(arr);
        }
        return matrix;
    };
    return Solver;
}());
export { Solver };
//# sourceMappingURL=solver.js.map