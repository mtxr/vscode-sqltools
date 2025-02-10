"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("./base");
var dependents_1 = require("../../dependents");
var bbox_1 = require("../../util/bbox");
var direction_1 = require("../../util/direction");
var constant_1 = require("../../constant");
var util_1 = require("@antv/util");
var helper_1 = require("../../util/helper");
var DEFAULT_PADDING = 0;
var DEFAULT_SIZE = 8;
var DEFAULT_CATEGORY_SIZE = 32;
var MIN_THUMB_LENGTH = 20;
var Scrollbar = /** @class */ (function (_super) {
    tslib_1.__extends(Scrollbar, _super);
    function Scrollbar(view) {
        var _this = _super.call(this, view) || this;
        _this.onChangeFn = util_1.noop;
        _this.resetMeasure = function () {
            _this.clear();
        };
        _this.onValueChange = function (_a) {
            var ratio = _a.ratio;
            var animate = _this.getValidScrollbarCfg().animate;
            _this.ratio = (0, util_1.clamp)(ratio, 0, 1);
            var originalAnimate = _this.view.getOptions().animate;
            if (!animate) {
                _this.view.animate(false);
            }
            _this.changeViewData(_this.getScrollRange(), true);
            _this.view.animate(originalAnimate);
        };
        _this.container = _this.view.getLayer(constant_1.LAYER.FORE).addGroup();
        _this.onChangeFn = (0, util_1.throttle)(_this.onValueChange, 20, {
            leading: true,
        });
        _this.trackLen = 0;
        _this.thumbLen = 0;
        _this.ratio = 0;
        _this.view.on(constant_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, _this.resetMeasure);
        _this.view.on(constant_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_SIZE, _this.resetMeasure);
        return _this;
    }
    Object.defineProperty(Scrollbar.prototype, "name", {
        get: function () {
            return 'scrollbar';
        },
        enumerable: false,
        configurable: true
    });
    Scrollbar.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.view.off(constant_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, this.resetMeasure);
        this.view.off(constant_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_SIZE, this.resetMeasure);
    };
    Scrollbar.prototype.init = function () { };
    /**
     * 渲染
     */
    Scrollbar.prototype.render = function () {
        this.option = this.view.getOptions().scrollbar;
        if (this.option) {
            if (this.scrollbar) {
                // exist, update
                this.scrollbar = this.updateScrollbar();
            }
            else {
                // not exist, create
                this.scrollbar = this.createScrollbar();
                this.scrollbar.component.on('scrollchange', this.onChangeFn);
            }
        }
        else {
            if (this.scrollbar) {
                // exist, destroy
                this.scrollbar.component.destroy();
                this.scrollbar = undefined;
            }
        }
    };
    /**
     * 布局
     */
    Scrollbar.prototype.layout = function () {
        var _this = this;
        if (this.option && !this.trackLen) {
            this.measureScrollbar();
            setTimeout(function () {
                if (!_this.view.destroyed) {
                    _this.changeViewData(_this.getScrollRange(), true);
                }
            });
        }
        if (this.scrollbar) {
            var width = this.view.coordinateBBox.width;
            var padding = this.scrollbar.component.get('padding');
            var bboxObject = this.scrollbar.component.getLayoutBBox();
            var bbox = new bbox_1.BBox(bboxObject.x, bboxObject.y, Math.min(bboxObject.width, width), bboxObject.height).expand(padding);
            var cfg = this.getScrollbarComponentCfg();
            var x = void 0;
            var y = void 0;
            if (cfg.isHorizontal) {
                var _a = tslib_1.__read((0, direction_1.directionToPosition)(this.view.viewBBox, bbox, constant_1.DIRECTION.BOTTOM), 2), x1 = _a[0], y1 = _a[1];
                var _b = tslib_1.__read((0, direction_1.directionToPosition)(this.view.coordinateBBox, bbox, constant_1.DIRECTION.BOTTOM), 2), x2 = _b[0], y2 = _b[1];
                x = x2;
                y = y1;
            }
            else {
                var _c = tslib_1.__read((0, direction_1.directionToPosition)(this.view.viewBBox, bbox, constant_1.DIRECTION.RIGHT), 2), x1 = _c[0], y1 = _c[1];
                var _d = tslib_1.__read((0, direction_1.directionToPosition)(this.view.viewBBox, bbox, constant_1.DIRECTION.RIGHT), 2), x2 = _d[0], y2 = _d[1];
                x = x2;
                y = y1;
            }
            x += padding[3];
            y += padding[0];
            // 默认放在 bottom
            if (this.trackLen) {
                this.scrollbar.component.update(tslib_1.__assign(tslib_1.__assign({}, cfg), { x: x, y: y, trackLen: this.trackLen, thumbLen: this.thumbLen, thumbOffset: (this.trackLen - this.thumbLen) * this.ratio }));
            }
            else {
                this.scrollbar.component.update(tslib_1.__assign(tslib_1.__assign({}, cfg), { x: x, y: y }));
            }
            this.view.viewBBox = this.view.viewBBox.cut(bbox, cfg.isHorizontal ? constant_1.DIRECTION.BOTTOM : constant_1.DIRECTION.RIGHT);
        }
    };
    /**
     * 更新
     */
    Scrollbar.prototype.update = function () {
        // 逻辑和 render 保持一致
        this.render();
    };
    Scrollbar.prototype.getComponents = function () {
        return this.scrollbar ? [this.scrollbar] : [];
    };
    Scrollbar.prototype.clear = function () {
        if (this.scrollbar) {
            this.scrollbar.component.destroy();
            this.scrollbar = undefined;
        }
        this.trackLen = 0;
        this.thumbLen = 0;
        this.ratio = 0;
        this.cnt = 0;
        this.step = 0;
        this.data = undefined;
        this.xScaleCfg = undefined;
        this.yScalesCfg = [];
    };
    /** 设置滚动条位置  */
    Scrollbar.prototype.setValue = function (ratio) {
        this.onValueChange({ ratio: ratio });
    };
    /** 获得滚动条位置  */
    Scrollbar.prototype.getValue = function () {
        return this.ratio;
    };
    /**
     * 获取 scrollbar 的主题配置
     */
    Scrollbar.prototype.getThemeOptions = function () {
        var theme = this.view.getTheme();
        return (0, util_1.get)(theme, ['components', 'scrollbar', 'common'], {});
    };
    /**
     * 获取 scrollbar 组件的主题样式
     */
    Scrollbar.prototype.getScrollbarTheme = function (style) {
        var theme = (0, util_1.get)(this.view.getTheme(), ['components', 'scrollbar']);
        var _a = style || {}, thumbHighlightColor = _a.thumbHighlightColor, restStyles = tslib_1.__rest(_a, ["thumbHighlightColor"]);
        return {
            default: (0, util_1.deepMix)({}, (0, util_1.get)(theme, ['default', 'style'], {}), restStyles),
            hover: (0, util_1.deepMix)({}, (0, util_1.get)(theme, ['hover', 'style'], {}), { thumbColor: thumbHighlightColor }),
        };
    };
    Scrollbar.prototype.measureScrollbar = function () {
        var xScale = this.view.getXScale();
        var yScales = this.view.getYScales().slice();
        this.data = this.getScrollbarData();
        this.step = this.getStep();
        this.cnt = this.getCnt();
        var _a = this.getScrollbarComponentCfg(), trackLen = _a.trackLen, thumbLen = _a.thumbLen;
        this.trackLen = trackLen;
        this.thumbLen = thumbLen;
        this.xScaleCfg = {
            field: xScale.field,
            values: xScale.values || [],
        };
        this.yScalesCfg = yScales;
    };
    Scrollbar.prototype.getScrollRange = function () {
        var startIdx = Math.floor((this.cnt - this.step) * (0, util_1.clamp)(this.ratio, 0, 1));
        var endIdx = Math.min(startIdx + this.step - 1, this.cnt - 1);
        return [startIdx, endIdx];
    };
    Scrollbar.prototype.changeViewData = function (_a, render) {
        var _this = this;
        var _b = tslib_1.__read(_a, 2), startIdx = _b[0], endIdx = _b[1];
        var type = this.getValidScrollbarCfg().type;
        var isHorizontal = type !== 'vertical';
        var values = (0, util_1.valuesOfKey)(this.data, this.xScaleCfg.field);
        // 如果是 xScale 数值类型，则进行排序
        var xScaleValues = this.view.getXScale().isLinear ? values.sort(function (a, b) { return Number(a) - Number(b); }) : values;
        var xValues = isHorizontal ? xScaleValues : xScaleValues.reverse();
        this.yScalesCfg.forEach(function (cfg) {
            _this.view.scale(cfg.field, {
                formatter: cfg.formatter,
                type: cfg.type,
                min: cfg.min,
                max: cfg.max,
                tickMethod: cfg.tickMethod
            });
        });
        this.view.filter(this.xScaleCfg.field, function (val) {
            var idx = xValues.indexOf(val);
            return idx > -1 ? (0, helper_1.isBetween)(idx, startIdx, endIdx) : true;
        });
        this.view.render(true);
    };
    Scrollbar.prototype.createScrollbar = function () {
        var type = this.getValidScrollbarCfg().type;
        var isHorizontal = type !== 'vertical';
        var component = new dependents_1.Scrollbar(tslib_1.__assign(tslib_1.__assign({ container: this.container }, this.getScrollbarComponentCfg()), { x: 0, y: 0 }));
        component.init();
        return {
            component: component,
            layer: constant_1.LAYER.FORE,
            direction: isHorizontal ? constant_1.DIRECTION.BOTTOM : constant_1.DIRECTION.RIGHT,
            type: constant_1.COMPONENT_TYPE.SCROLLBAR,
        };
    };
    Scrollbar.prototype.updateScrollbar = function () {
        var config = this.getScrollbarComponentCfg();
        var realConfig = this.trackLen
            ? tslib_1.__assign(tslib_1.__assign({}, config), { trackLen: this.trackLen, thumbLen: this.thumbLen, thumbOffset: (this.trackLen - this.thumbLen) * this.ratio }) : tslib_1.__assign({}, config);
        this.scrollbar.component.update(realConfig);
        return this.scrollbar;
    };
    Scrollbar.prototype.getStep = function () {
        if (this.step) {
            return this.step;
        }
        var coordinateBBox = this.view.coordinateBBox;
        var _a = this.getValidScrollbarCfg(), type = _a.type, categorySize = _a.categorySize;
        var isHorizontal = type !== 'vertical';
        return Math.floor((isHorizontal ? coordinateBBox.width : coordinateBBox.height) / categorySize);
    };
    Scrollbar.prototype.getCnt = function () {
        if (this.cnt) {
            return this.cnt;
        }
        var xScale = this.view.getXScale();
        var data = this.getScrollbarData();
        var values = (0, util_1.valuesOfKey)(data, xScale.field);
        return (0, util_1.size)(values);
    };
    Scrollbar.prototype.getScrollbarComponentCfg = function () {
        var _a = this.view, coordinateBBox = _a.coordinateBBox, viewBBox = _a.viewBBox;
        var _b = this.getValidScrollbarCfg(), type = _b.type, padding = _b.padding, width = _b.width, height = _b.height, style = _b.style;
        var isHorizontal = type !== 'vertical';
        var _c = tslib_1.__read(padding, 4), paddingTop = _c[0], paddingRight = _c[1], paddingBottom = _c[2], paddingLeft = _c[3];
        var position = isHorizontal
            ? {
                x: coordinateBBox.minX + paddingLeft,
                y: viewBBox.maxY - height - paddingBottom,
            }
            : {
                x: viewBBox.maxX - width - paddingRight,
                y: coordinateBBox.minY + paddingTop,
            };
        var step = this.getStep();
        var cnt = this.getCnt();
        var trackLen = isHorizontal
            ? coordinateBBox.width - paddingLeft - paddingRight
            : coordinateBBox.height - paddingTop - paddingBottom;
        var thumbLen = Math.max(trackLen * (0, util_1.clamp)(step / cnt, 0, 1), MIN_THUMB_LENGTH);
        return tslib_1.__assign(tslib_1.__assign({}, this.getThemeOptions()), { x: position.x, y: position.y, size: isHorizontal ? height : width, isHorizontal: isHorizontal, trackLen: trackLen, thumbLen: thumbLen, thumbOffset: 0, theme: this.getScrollbarTheme(style) });
    };
    /**
     * 填充一些默认的配置项目
     */
    Scrollbar.prototype.getValidScrollbarCfg = function () {
        var cfg = {
            type: 'horizontal',
            categorySize: DEFAULT_CATEGORY_SIZE,
            width: DEFAULT_SIZE,
            height: DEFAULT_SIZE,
            padding: [0, 0, 0, 0],
            animate: true,
            style: {},
        };
        if ((0, util_1.isObject)(this.option)) {
            cfg = tslib_1.__assign(tslib_1.__assign({}, cfg), this.option);
        }
        if (!(0, util_1.isObject)(this.option) || !this.option.padding) {
            cfg.padding =
                cfg.type === 'horizontal' ? [DEFAULT_PADDING, 0, DEFAULT_PADDING, 0] : [0, DEFAULT_PADDING, 0, DEFAULT_PADDING];
        }
        return cfg;
    };
    /**
     * 获取数据
     */
    Scrollbar.prototype.getScrollbarData = function () {
        var coordinate = this.view.getCoordinate();
        var cfg = this.getValidScrollbarCfg();
        var data = this.view.getOptions().data || [];
        // 纵向做了 y 轴镜像之后，数据也需要镜像反转
        if (coordinate.isReflect('y') && cfg.type === 'vertical') {
            data = tslib_1.__spreadArray([], tslib_1.__read(data), false).reverse();
        }
        return data;
    };
    return Scrollbar;
}(base_1.Controller));
exports.default = Scrollbar;
//# sourceMappingURL=scrollbar.js.map