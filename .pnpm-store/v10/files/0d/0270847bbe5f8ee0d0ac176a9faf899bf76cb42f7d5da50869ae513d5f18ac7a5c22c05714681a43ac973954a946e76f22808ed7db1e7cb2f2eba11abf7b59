import { assign, isEmpty, isFunction, isNil, isNumber, isObject, isString, map } from '@antv/util';
import { getTickMethod } from './tick-method/register';
var Scale = /** @class */ (function () {
    function Scale(cfg) {
        /**
         * 度量的类型
         */
        this.type = 'base';
        /**
         * 是否分类类型的度量
         */
        this.isCategory = false;
        /**
         * 是否线性度量，有linear, time 度量
         */
        this.isLinear = false;
        /**
         * 是否连续类型的度量，linear,time,log, pow, quantile, quantize 都支持
         */
        this.isContinuous = false;
        /**
         * 是否是常量的度量，传入和传出一致
         */
        this.isIdentity = false;
        this.values = [];
        this.range = [0, 1];
        this.ticks = [];
        this.__cfg__ = cfg;
        this.initCfg();
        this.init();
    }
    // 对于原始值的必要转换，如分类、时间字段需转换成数值，用transform/map命名可能更好
    Scale.prototype.translate = function (v) {
        return v;
    };
    /** 重新初始化 */
    Scale.prototype.change = function (cfg) {
        // 覆盖配置项，而不替代
        assign(this.__cfg__, cfg);
        this.init();
    };
    Scale.prototype.clone = function () {
        return this.constructor(this.__cfg__);
    };
    /** 获取坐标轴需要的ticks */
    Scale.prototype.getTicks = function () {
        var _this = this;
        return map(this.ticks, function (tick, idx) {
            if (isObject(tick)) {
                // 仅当符合Tick类型时才有意义
                return tick;
            }
            return {
                text: _this.getText(tick, idx),
                tickValue: tick,
                value: _this.scale(tick),
            };
        });
    };
    /** 获取Tick的格式化结果 */
    Scale.prototype.getText = function (value, key) {
        var formatter = this.formatter;
        var res = formatter ? formatter(value, key) : value;
        if (isNil(res) || !isFunction(res.toString)) {
            return '';
        }
        return res.toString();
    };
    // 获取配置项中的值，当前 scale 上的值可能会被修改
    Scale.prototype.getConfig = function (key) {
        return this.__cfg__[key];
    };
    // scale初始化
    Scale.prototype.init = function () {
        assign(this, this.__cfg__);
        this.setDomain();
        if (isEmpty(this.getConfig('ticks'))) {
            this.ticks = this.calculateTicks();
        }
    };
    // 子类上覆盖某些属性，不能直接在类上声明，否则会被覆盖
    Scale.prototype.initCfg = function () { };
    Scale.prototype.setDomain = function () { };
    Scale.prototype.calculateTicks = function () {
        var tickMethod = this.tickMethod;
        var ticks = [];
        if (isString(tickMethod)) {
            var method = getTickMethod(tickMethod);
            if (!method) {
                throw new Error('There is no method to to calculate ticks!');
            }
            ticks = method(this);
        }
        else if (isFunction(tickMethod)) {
            ticks = tickMethod(this);
        }
        return ticks;
    };
    // range 的最小值
    Scale.prototype.rangeMin = function () {
        return this.range[0];
    };
    // range 的最大值
    Scale.prototype.rangeMax = function () {
        return this.range[1];
    };
    /** 定义域转 0~1 */
    Scale.prototype.calcPercent = function (value, min, max) {
        if (isNumber(value)) {
            return (value - min) / (max - min);
        }
        return NaN;
    };
    /** 0~1转定义域 */
    Scale.prototype.calcValue = function (percent, min, max) {
        return min + percent * (max - min);
    };
    return Scale;
}());
export default Scale;
//# sourceMappingURL=base.js.map