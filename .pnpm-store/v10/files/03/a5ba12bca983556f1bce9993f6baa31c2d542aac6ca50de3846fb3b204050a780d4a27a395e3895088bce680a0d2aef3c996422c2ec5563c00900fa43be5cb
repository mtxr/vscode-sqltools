import { __read } from "tslib";
import { isNumber } from '@antv/util';
import { multiply } from './gauss';
import { Variable } from './variable';
/**
 * 定义一个约束条件
 */
var Constraint = /** @class */ (function () {
    function Constraint(operator) {
        var elements = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            elements[_i - 1] = arguments[_i];
        }
        this.operator = operator;
        this.elements = elements;
    }
    /**
     * 获得表达式中所有的变量
     */
    Constraint.prototype.getVariables = function () {
        var vars = [];
        // todo 去重
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];
            element = Array.isArray(element) ? element : [element];
            // @ts-ignore
            for (var j = 0; j < element.length; j++) {
                var el = element[j];
                if (Variable.isVariable(el)) {
                    vars.push(el);
                }
            }
        }
        return vars;
    };
    /**
     * 获得方程组的高斯矩阵数组
     * 按照指定的 variable 顺序
     * @param variableMap 变量对应的 idx
     */
    Constraint.prototype.getGaussArr = function (variableMap) {
        var _this = this;
        var size = variableMap.size;
        // size 额外加上 b 常量
        var arr = new Array(size + 1).fill(0);
        this.elements.forEach(function (element) {
            var _a = __read(_this.parseElement(element), 2), a = _a[0], variable = _a[1];
            var idx = variableMap.get(variable);
            // 存在 -> 变量
            if (isNumber(idx)) {
                arr[idx] += a;
            }
            else {
                // 常数（最后一位）
                arr[size] += a;
            }
        });
        return arr;
    };
    /**
     * 解析 element，产生 [a, variable]
     * @param element
     */
    Constraint.prototype.parseElement = function (e) {
        if (isNumber(e)) {
            return [e, undefined];
        }
        if (Variable.isVariable(e)) {
            return [1, e];
        }
        if (Array.isArray(e)) {
            var mul = multiply(e.filter(function (i) { return isNumber(i); }));
            var variable = e.find(function (i) { return Variable.isVariable(i); });
            return [mul, variable];
        }
        // 其他非法情况
        return [0, undefined];
    };
    return Constraint;
}());
export { Constraint };
//# sourceMappingURL=constraint.js.map