"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
// todo 这个到底目的是什么？
var toScaleString = function (scale, value) {
    if ((0, util_1.isString)(value)) {
        return value;
    }
    return scale.invert(scale.scale(value));
};
/**
 * 所有视觉通道属性的基类
 * @class Base
 */
var Attribute = /** @class */ (function () {
    function Attribute(cfg) {
        this.names = [];
        this.scales = [];
        this.linear = false;
        this.values = [];
        this.callback = function () { return []; };
        // 解析配置
        this._parseCfg(cfg);
    }
    /**
     * 映射的值组成的数组
     * @param params 对应 scale 顺序的值传入
     */
    Attribute.prototype.mapping = function () {
        var _this = this;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var values = params.map(function (param, idx) {
            return _this._toOriginParam(param, _this.scales[idx]);
        });
        return this.callback.apply(this, values);
    };
    /**
     * 如果进行线性映射，返回对应的映射值
     * @param percent
     */
    Attribute.prototype.getLinearValue = function (percent) {
        // 分段数量
        var steps = this.values.length - 1;
        var step = Math.floor(steps * percent);
        var leftPercent = steps * percent - step;
        // todo 不懂这个逻辑
        var start = this.values[step];
        var end = step === steps ? start : this.values[step + 1];
        // 线性方程
        return start + (end - start) * leftPercent;
    };
    /**
     * 根据度量获取属性名
     */
    Attribute.prototype.getNames = function () {
        var scales = this.scales;
        var names = this.names;
        var length = Math.min(scales.length, names.length);
        var rst = [];
        for (var i = 0; i < length; i += 1) {
            rst.push(names[i]);
        }
        return rst;
    };
    /**
     * 获取所有的维度名
     */
    Attribute.prototype.getFields = function () {
        return this.scales.map(function (scale) { return scale.field; });
    };
    /**
     * 根据名称获取度量
     * @param name
     */
    Attribute.prototype.getScale = function (name) {
        return this.scales[this.names.indexOf(name)];
    };
    /**
     * 默认的回调函数（用户没有自定义 callback，或者用户自定义 callback 返回空的时候，使用 values 映射）
     * @param params
     */
    Attribute.prototype.defaultCallback = function () {
        var _this = this;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        // 没有 params 的情况，是指没有指定 fields，直接返回配置的 values 常量
        if (params.length === 0) {
            return this.values;
        }
        return params.map(function (param, idx) {
            var scale = _this.scales[idx];
            return scale.type === 'identity' ? scale.values[0] : _this._getAttributeValue(scale, param);
        });
    };
    // 解析配置
    Attribute.prototype._parseCfg = function (cfg) {
        var _this = this;
        var _a = cfg.type, type = _a === void 0 ? 'base' : _a, _b = cfg.names, names = _b === void 0 ? [] : _b, _c = cfg.scales, scales = _c === void 0 ? [] : _c, _d = cfg.values, values = _d === void 0 ? [] : _d, callback = cfg.callback;
        this.type = type;
        this.scales = scales;
        this.values = values;
        this.names = names;
        // 构造 callback 方法
        this.callback = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            /**
             * 当用户设置的 callback 返回 null 时, 应该返回默认 callback 中的值
             */
            if (callback) {
                // 使用用户返回的值处理
                var ret = callback.apply(void 0, params);
                if (!(0, util_1.isNil)(ret)) {
                    return [ret];
                }
            }
            // 没有 callback 或者用户 callback 返回值为空，则使用默认的逻辑处理
            return _this.defaultCallback.apply(_this, params);
        };
    };
    // 获取属性值，将值映射到视觉通道
    Attribute.prototype._getAttributeValue = function (scale, value) {
        // 如果是非线性的字段，直接从 values 中取值即可
        if (scale.isCategory && !this.linear) {
            // 离散 scale 变换成索引
            var idx = scale.translate(value);
            return this.values[idx % this.values.length];
        }
        // 线性则使用线性值
        var percent = scale.scale(value);
        return this.getLinearValue(percent);
    };
    /**
     * 通过 scale 拿到数据对应的原始的参数
     * @param param
     * @param scale
     * @private
     */
    Attribute.prototype._toOriginParam = function (param, scale) {
        // 是线性，直接返回
        // 非线性，使用 scale 变换
        return !scale.isLinear
            ? (0, util_1.isArray)(param)
                ? param.map(function (p) { return toScaleString(scale, p); })
                : toScaleString(scale, param)
            : param;
    };
    return Attribute;
}());
exports.default = Attribute;
//# sourceMappingURL=base.js.map