"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var scale_transform_1 = tslib_1.__importDefault(require("./scale-transform"));
/**
 * 缩放 Scale 的 Action
 * @ignore
 */
var ScaleTranslate = /** @class */ (function (_super) {
    tslib_1.__extends(ScaleTranslate, _super);
    function ScaleTranslate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.zoomRatio = 0.05;
        return _this;
        // 平移分类的度量
        // private translateCategory(dim, scale, normalPoint) {
        // }
    }
    /**
     * 缩小
     */
    ScaleTranslate.prototype.zoomIn = function () {
        this.zoom(this.zoomRatio);
    };
    ScaleTranslate.prototype.zoom = function (scale) {
        var _this = this;
        var dims = this.dims;
        (0, util_1.each)(dims, function (dim) {
            _this.zoomDim(dim, scale);
        });
        this.context.view.render(true);
    };
    /**
     * 放大
     */
    ScaleTranslate.prototype.zoomOut = function () {
        this.zoom(-1 * this.zoomRatio);
    };
    // 缩放度量
    ScaleTranslate.prototype.zoomDim = function (dim, dRatio) {
        if (this.hasDim(dim)) {
            var scale = this.getScale(dim);
            if (scale.isLinear) {
                this.zoomLinear(dim, scale, dRatio);
            }
            //  else { // 暂时仅处理连续字段
            // this.zoomCategory(dim, scale, normalPoint);
            // }
        }
    };
    // linear 度量平移
    ScaleTranslate.prototype.zoomLinear = function (dim, scale, dRatio) {
        var view = this.context.view;
        // 只有第一次缓存，否则无法回滚
        if (!this.cacheScaleDefs[dim]) {
            this.cacheScaleDefs[dim] = {
                // @ts-ignore
                nice: scale.nice,
                min: scale.min,
                max: scale.max,
            };
        }
        // 使用使用原始度量作为缩放标准
        var scaleDef = this.cacheScaleDefs[dim];
        var range = scaleDef.max - scaleDef.min;
        var min = scale.min, max = scale.max;
        var d = dRatio * range;
        var toMin = min - d;
        var toMax = max + d;
        var curRange = toMax - toMin;
        var scaled = curRange / range;
        if (toMax > toMin && scaled < 100 && scaled > 0.01) {
            view.scale(scale.field, {
                // @ts-ignore
                nice: false,
                min: min - d,
                max: max + d,
            });
        }
    };
    return ScaleTranslate;
}(scale_transform_1.default));
exports.default = ScaleTranslate;
//# sourceMappingURL=scale-zoom.js.map