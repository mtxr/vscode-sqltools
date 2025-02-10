"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var scale_transform_1 = tslib_1.__importDefault(require("./scale-transform"));
/**
 * 拖拽 Scale 的 Action
 * @ignore
 */
var ScaleTranslate = /** @class */ (function (_super) {
    tslib_1.__extends(ScaleTranslate, _super);
    function ScaleTranslate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startPoint = null;
        _this.starting = false;
        _this.startCache = {};
        return _this;
    }
    /**
     * 开始
     */
    ScaleTranslate.prototype.start = function () {
        var _this = this;
        this.startPoint = this.context.getCurrentPoint();
        this.starting = true;
        var dims = this.dims;
        (0, util_1.each)(dims, function (dim) {
            var scale = _this.getScale(dim);
            var min = scale.min, max = scale.max, values = scale.values;
            _this.startCache[dim] = { min: min, max: max, values: values };
        });
    };
    // 平移分类的度量
    // private translateCategory(dim, scale, normalPoint) {
    // }
    /**
     * 结束
     */
    ScaleTranslate.prototype.end = function () {
        this.startPoint = null;
        this.starting = false;
        this.startCache = {};
    };
    /**
     * 平移
     */
    ScaleTranslate.prototype.translate = function () {
        var _this = this;
        if (!this.starting) {
            return;
        }
        var startPoint = this.startPoint;
        var coord = this.context.view.getCoordinate();
        var currentPoint = this.context.getCurrentPoint();
        var normalStart = coord.invert(startPoint);
        var noramlCurrent = coord.invert(currentPoint);
        var dx = noramlCurrent.x - normalStart.x;
        var dy = noramlCurrent.y - normalStart.y;
        var view = this.context.view;
        var dims = this.dims;
        (0, util_1.each)(dims, function (dim) {
            _this.translateDim(dim, { x: dx * -1, y: dy * -1 });
        });
        view.render(true);
    };
    // 平移度量
    ScaleTranslate.prototype.translateDim = function (dim, normalPoint) {
        if (this.hasDim(dim)) {
            var scale = this.getScale(dim);
            if (scale.isLinear) {
                this.translateLinear(dim, scale, normalPoint);
            }
            //  else { // 暂时仅处理连续字段
            // this.translateCategory(dim, scale, normalPoint);
            // }
        }
    };
    // linear 度量平移
    ScaleTranslate.prototype.translateLinear = function (dim, scale, normalPoint) {
        var view = this.context.view;
        var _a = this.startCache[dim], min = _a.min, max = _a.max;
        var range = max - min;
        var d = normalPoint[dim] * range;
        // 只有第一次缓存，否则无法回滚
        if (!this.cacheScaleDefs[dim]) {
            this.cacheScaleDefs[dim] = {
                // @ts-ignore
                nice: scale.nice,
                min: min,
                max: max,
            };
        }
        view.scale(scale.field, {
            // @ts-ignore
            nice: false,
            min: min + d,
            max: max + d,
        });
    };
    // 平移分类的度量
    // private translateCategory(dim, scale, normalPoint) {
    // }
    /**
     * 回滚
     */
    ScaleTranslate.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.startPoint = null;
        this.starting = false;
    };
    return ScaleTranslate;
}(scale_transform_1.default));
exports.default = ScaleTranslate;
//# sourceMappingURL=scale-translate.js.map