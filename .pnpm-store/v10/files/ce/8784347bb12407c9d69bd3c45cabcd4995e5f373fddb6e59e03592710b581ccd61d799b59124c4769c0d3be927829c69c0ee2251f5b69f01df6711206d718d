"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
/**
 * 分类度量
 * @class
 */
var Category = /** @class */ (function (_super) {
    tslib_1.__extends(Category, _super);
    function Category() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'cat';
        _this.isCategory = true;
        return _this;
    }
    Category.prototype.buildIndexMap = function () {
        if (!this.translateIndexMap) {
            this.translateIndexMap = new Map();
            // 重新构建缓存
            for (var i = 0; i < this.values.length; i++) {
                this.translateIndexMap.set(this.values[i], i);
            }
        }
    };
    Category.prototype.translate = function (value) {
        // 按需构建 map
        this.buildIndexMap();
        // 找得到
        var idx = this.translateIndexMap.get(value);
        if (idx === undefined) {
            idx = util_1.isNumber(value) ? value : NaN;
        }
        return idx;
    };
    Category.prototype.scale = function (value) {
        var order = this.translate(value);
        // 分类数据允许 0.5 范围内调整
        // if (order < this.min - 0.5 || order > this.max + 0.5) {
        //   return NaN;
        // }
        var percent = this.calcPercent(order, this.min, this.max);
        return this.calcValue(percent, this.rangeMin(), this.rangeMax());
    };
    Category.prototype.invert = function (scaledValue) {
        var domainRange = this.max - this.min;
        var percent = this.calcPercent(scaledValue, this.rangeMin(), this.rangeMax());
        var idx = Math.round(domainRange * percent) + this.min;
        if (idx < this.min || idx > this.max) {
            return NaN;
        }
        return this.values[idx];
    };
    Category.prototype.getText = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var v = value;
        // value为index
        if (util_1.isNumber(value) && !this.values.includes(value)) {
            v = this.values[v];
        }
        return _super.prototype.getText.apply(this, tslib_1.__spreadArrays([v], args));
    };
    // 复写属性
    Category.prototype.initCfg = function () {
        this.tickMethod = 'cat';
    };
    // 设置 min, max
    Category.prototype.setDomain = function () {
        // 用户有可能设置 min
        if (util_1.isNil(this.getConfig('min'))) {
            this.min = 0;
        }
        if (util_1.isNil(this.getConfig('max'))) {
            var size = this.values.length;
            this.max = size > 1 ? size - 1 : size;
        }
        // scale.init 的时候清除缓存
        if (this.translateIndexMap) {
            this.translateIndexMap = undefined;
        }
    };
    return Category;
}(base_1.default));
exports.default = Category;
//# sourceMappingURL=base.js.map