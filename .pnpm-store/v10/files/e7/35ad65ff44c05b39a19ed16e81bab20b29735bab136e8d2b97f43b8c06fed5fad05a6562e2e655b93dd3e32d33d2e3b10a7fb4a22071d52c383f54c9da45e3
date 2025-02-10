"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heatmap = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
// registered shapes
require("./shapes/circle");
require("./shapes/square");
var Heatmap = /** @class */ (function (_super) {
    tslib_1.__extends(Heatmap, _super);
    function Heatmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'heatmap';
        return _this;
    }
    /**
     * 获取 柱形图 默认配置项
     * 供外部使用
     */
    Heatmap.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * 获取直方图的适配器
     */
    Heatmap.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    /**
     * 获取 色块图 默认配置
     */
    Heatmap.prototype.getDefaultOptions = function () {
        return Heatmap.getDefaultOptions();
    };
    return Heatmap;
}(plot_1.Plot));
exports.Heatmap = Heatmap;
//# sourceMappingURL=index.js.map