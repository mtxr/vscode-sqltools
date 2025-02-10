"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Histogram = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var histogram_1 = require("../../utils/transform/histogram");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
var Histogram = /** @class */ (function (_super) {
    tslib_1.__extends(Histogram, _super);
    function Histogram() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'histogram';
        return _this;
    }
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    Histogram.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    Histogram.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this.options, binField = _a.binField, binNumber = _a.binNumber, binWidth = _a.binWidth, stackField = _a.stackField;
        this.chart.changeData((0, histogram_1.binHistogram)(data, binField, binWidth, binNumber, stackField));
    };
    /**
     * 获取直方图的适配器
     */
    Histogram.prototype.getDefaultOptions = function () {
        return Histogram.getDefaultOptions();
    };
    /**
     * 获取直方图的适配器
     */
    Histogram.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Histogram;
}(plot_1.Plot));
exports.Histogram = Histogram;
//# sourceMappingURL=index.js.map