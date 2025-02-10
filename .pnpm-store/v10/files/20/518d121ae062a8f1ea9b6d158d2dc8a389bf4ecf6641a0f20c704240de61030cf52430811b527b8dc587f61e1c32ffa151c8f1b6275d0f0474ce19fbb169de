"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../../constant");
var dependents_1 = require("../../dependents");
var bbox_1 = require("../../util/bbox");
var direction_1 = require("../../util/direction");
var helper_1 = require("../../util/helper");
var base_1 = require("./base");
/**
 * @ignore
 * slider Controller
 */
var Slider = /** @class */ (function (_super) {
    tslib_1.__extends(Slider, _super);
    function Slider(view) {
        var _this = _super.call(this, view) || this;
        _this.onChangeFn = util_1.noop;
        /**
         * 清除测量
         */
        _this.resetMeasure = function () {
            _this.clear();
        };
        /**
         * 滑块滑动的时候出发
         * @param v
         */
        _this.onValueChange = function (v) {
            var _a = tslib_1.__read(v, 2), min = _a[0], max = _a[1];
            _this.start = min;
            _this.end = max;
            _this.changeViewData(min, max);
        };
        _this.container = _this.view.getLayer(constant_1.LAYER.FORE).addGroup();
        _this.onChangeFn = (0, util_1.throttle)(_this.onValueChange, 20, {
            leading: true,
        });
        _this.width = 0;
        _this.view.on(constant_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, _this.resetMeasure);
        _this.view.on(constant_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_SIZE, _this.resetMeasure);
        return _this;
    }
    Object.defineProperty(Slider.prototype, "name", {
        get: function () {
            return 'slider';
        },
        enumerable: false,
        configurable: true
    });
    Slider.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.view.off(constant_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, this.resetMeasure);
        this.view.off(constant_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_SIZE, this.resetMeasure);
    };
    /**
     * 初始化
     */
    Slider.prototype.init = function () { };
    /**
     * 渲染
     */
    Slider.prototype.render = function () {
        this.option = this.view.getOptions().slider;
        var _a = this.getSliderCfg(), start = _a.start, end = _a.end;
        if ((0, util_1.isNil)(this.start)) {
            this.start = start;
            this.end = end;
        }
        var viewData = this.view.getOptions().data;
        if (this.option && !(0, util_1.isEmpty)(viewData)) {
            if (this.slider) {
                // exist, update
                this.slider = this.updateSlider();
            }
            else {
                // not exist, create
                this.slider = this.createSlider();
                // 监听事件，绑定交互
                this.slider.component.on('sliderchange', this.onChangeFn);
            }
        }
        else {
            if (this.slider) {
                // exist, destroy
                this.slider.component.destroy();
                this.slider = undefined;
            }
            else {
                // do nothing
            }
        }
    };
    /**
     * 布局
     */
    Slider.prototype.layout = function () {
        var _this = this;
        if (this.option && !this.width) {
            this.measureSlider();
            setTimeout(function () {
                // 初始状态下的 view 数据过滤
                if (!_this.view.destroyed) {
                    _this.changeViewData(_this.start, _this.end);
                }
            }, 0);
        }
        if (this.slider) {
            var width = this.view.coordinateBBox.width;
            // 获取组件的 layout bbox
            var padding = this.slider.component.get('padding');
            var _a = tslib_1.__read(padding, 4), paddingTop = _a[0], paddingRight = _a[1], paddingBottom = _a[2], paddingLeft = _a[3];
            var bboxObject = this.slider.component.getLayoutBBox();
            var bbox = new bbox_1.BBox(bboxObject.x, bboxObject.y, Math.min(bboxObject.width, width), bboxObject.height).expand(padding);
            var _b = this.getMinMaxText(this.start, this.end), minText = _b.minText, maxText = _b.maxText;
            var _c = tslib_1.__read((0, direction_1.directionToPosition)(this.view.viewBBox, bbox, constant_1.DIRECTION.BOTTOM), 2), x1 = _c[0], y1 = _c[1];
            var _d = tslib_1.__read((0, direction_1.directionToPosition)(this.view.coordinateBBox, bbox, constant_1.DIRECTION.BOTTOM), 2), x2 = _d[0], y2 = _d[1];
            // 默认放在 bottom
            this.slider.component.update(tslib_1.__assign(tslib_1.__assign({}, this.getSliderCfg()), { x: x2 + paddingLeft, y: y1 + paddingTop, width: this.width, start: this.start, end: this.end, minText: minText, maxText: maxText }));
            this.view.viewBBox = this.view.viewBBox.cut(bbox, constant_1.DIRECTION.BOTTOM);
        }
    };
    /**
     * 更新
     */
    Slider.prototype.update = function () {
        // 逻辑和 render 保持一致
        this.render();
    };
    /**
     * 创建 slider 组件
     */
    Slider.prototype.createSlider = function () {
        var cfg = this.getSliderCfg();
        // 添加 slider 组件
        var component = new dependents_1.Slider(tslib_1.__assign({ container: this.container }, cfg));
        component.init();
        return {
            component: component,
            layer: constant_1.LAYER.FORE,
            direction: constant_1.DIRECTION.BOTTOM,
            type: constant_1.COMPONENT_TYPE.SLIDER,
        };
    };
    /**
     * 更新配置
     */
    Slider.prototype.updateSlider = function () {
        var cfg = this.getSliderCfg();
        if (this.width) {
            var _a = this.getMinMaxText(this.start, this.end), minText = _a.minText, maxText = _a.maxText;
            cfg = tslib_1.__assign(tslib_1.__assign({}, cfg), { width: this.width, start: this.start, end: this.end, minText: minText, maxText: maxText });
        }
        this.slider.component.update(cfg);
        return this.slider;
    };
    /**
     * 进行测量操作
     */
    Slider.prototype.measureSlider = function () {
        var width = this.getSliderCfg().width;
        this.width = width;
    };
    /**
     * 生成 slider 配置
     */
    Slider.prototype.getSliderCfg = function () {
        var cfg = {
            height: 16,
            start: 0,
            end: 1,
            minText: '',
            maxText: '',
            x: 0,
            y: 0,
            width: this.view.coordinateBBox.width,
        };
        if ((0, util_1.isObject)(this.option)) {
            // 用户配置的数据，优先级更高
            var trendCfg = tslib_1.__assign({ data: this.getData() }, (0, util_1.get)(this.option, 'trendCfg', {}));
            // 因为有样式，所以深层覆盖
            cfg = (0, util_1.deepMix)({}, cfg, this.getThemeOptions(), this.option);
            // trendCfg 因为有数据数组，所以使用浅替换
            cfg = tslib_1.__assign(tslib_1.__assign({}, cfg), { trendCfg: trendCfg });
        }
        cfg.start = (0, util_1.clamp)(Math.min((0, util_1.isNil)(cfg.start) ? 0 : cfg.start, (0, util_1.isNil)(cfg.end) ? 1 : cfg.end), 0, 1);
        cfg.end = (0, util_1.clamp)(Math.max((0, util_1.isNil)(cfg.start) ? 0 : cfg.start, (0, util_1.isNil)(cfg.end) ? 1 : cfg.end), 0, 1);
        return cfg;
    };
    /**
     * 从 view 中获取数据，缩略轴使用全量的数据
     */
    Slider.prototype.getData = function () {
        var data = this.view.getOptions().data;
        var _a = tslib_1.__read(this.view.getYScales(), 1), yScale = _a[0];
        var groupScales = this.view.getGroupScales();
        if (groupScales.length) {
            var _b = groupScales[0], field_1 = _b.field, ticks_1 = _b.ticks;
            return data.reduce(function (pre, cur) {
                if (cur[field_1] === ticks_1[0]) {
                    pre.push(cur[yScale.field]);
                }
                return pre;
            }, []);
        }
        return data.map(function (datum) { return datum[yScale.field] || 0; });
    };
    /**
     * 获取 slider 的主题配置
     */
    Slider.prototype.getThemeOptions = function () {
        var theme = this.view.getTheme();
        return (0, util_1.get)(theme, ['components', 'slider', 'common'], {});
    };
    /**
     * 根据 start/end 和当前数据计算出当前的 minText/maxText
     * @param min
     * @param max
     */
    Slider.prototype.getMinMaxText = function (min, max) {
        var data = this.view.getOptions().data;
        var xScale = this.view.getXScale();
        var isHorizontal = true;
        var values = (0, util_1.valuesOfKey)(data, xScale.field);
        // 如果是 xScale 数值类型，则进行排序
        if (xScale.isLinear) {
            values = values.sort();
        }
        var xValues = isHorizontal ? values : values.reverse();
        var dataSize = (0, util_1.size)(data);
        if (!xScale || !dataSize) {
            return {}; // fix: 需要兼容，否则调用方直接取值会报错
        }
        var xTickCount = (0, util_1.size)(xValues);
        var minIndex = Math.round(min * (xTickCount - 1));
        var maxIndex = Math.round(max * (xTickCount - 1));
        var minText = (0, util_1.get)(xValues, [minIndex]);
        var maxText = (0, util_1.get)(xValues, [maxIndex]);
        var formatter = this.getSliderCfg().formatter;
        if (formatter) {
            minText = formatter(minText, data[minIndex], minIndex);
            maxText = formatter(maxText, data[maxIndex], maxIndex);
        }
        return {
            minText: minText,
            maxText: maxText,
        };
    };
    /**
     * 更新 view 过滤数据
     * @param min
     * @param max
     */
    Slider.prototype.changeViewData = function (min, max) {
        var data = this.view.getOptions().data;
        var xScale = this.view.getXScale();
        var dataSize = (0, util_1.size)(data);
        if (!xScale || !dataSize) {
            return;
        }
        var isHorizontal = true;
        var values = (0, util_1.valuesOfKey)(data, xScale.field);
        // 如果是 xScale 数值类型，则进行排序
        var xScaleValues = this.view.getXScale().isLinear ? values.sort(function (a, b) { return Number(a) - Number(b); }) : values;
        var xValues = isHorizontal ? xScaleValues : xScaleValues.reverse();
        var xTickCount = (0, util_1.size)(xValues);
        var minIndex = Math.round(min * (xTickCount - 1));
        var maxIndex = Math.round(max * (xTickCount - 1));
        // 增加 x 轴的过滤器
        this.view.filter(xScale.field, function (value, datum) {
            var idx = xValues.indexOf(value);
            return idx > -1 ? (0, helper_1.isBetween)(idx, minIndex, maxIndex) : true;
        });
        this.view.render(true);
    };
    /**
     * 覆写父类方法
     */
    Slider.prototype.getComponents = function () {
        return this.slider ? [this.slider] : [];
    };
    /**
     * 覆盖父类
     */
    Slider.prototype.clear = function () {
        if (this.slider) {
            this.slider.component.destroy();
            this.slider = undefined;
        }
        this.width = 0;
        this.start = undefined;
        this.end = undefined;
    };
    return Slider;
}(base_1.Controller));
exports.default = Slider;
//# sourceMappingURL=slider.js.map