"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gauge = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constants_1 = require("./constants");
// 注册 shape
require("./shapes/indicator");
require("./shapes/meter-gauge");
var utils_1 = require("./utils");
/**
 * 仪表盘
 */
var Gauge = /** @class */ (function (_super) {
    tslib_1.__extends(Gauge, _super);
    function Gauge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'gauge';
        return _this;
    }
    /**
     * 获取 仪表盘 默认配置项
     * 供外部使用
     */
    Gauge.getDefaultOptions = function () {
        return constants_1.DEFAULT_OPTIONS;
    };
    /**
     * 更新数据
     * @param percent
     */
    Gauge.prototype.changeData = function (percent) {
        this.chart.emit(g2_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, g2_1.Event.fromData(this.chart, g2_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        this.updateOption({ percent: percent });
        var indicatorView = this.chart.views.find(function (v) { return v.id === constants_1.INDICATEOR_VIEW_ID; });
        if (indicatorView) {
            indicatorView.data((0, utils_1.getIndicatorData)(percent));
        }
        var rangeView = this.chart.views.find(function (v) { return v.id === constants_1.RANGE_VIEW_ID; });
        if (rangeView) {
            rangeView.data((0, utils_1.getRangeData)(percent, this.options.range));
        }
        // todo 后续让 G2 层在 afterrender 之后，来重绘 annotations
        (0, adaptor_1.statistic)({ chart: this.chart, options: this.options }, true);
        this.chart.emit(g2_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, g2_1.Event.fromData(this.chart, g2_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    /**
     * 获取默认配置
     * 供 base 使用
     */
    Gauge.prototype.getDefaultOptions = function () {
        return Gauge.getDefaultOptions();
    };
    /**
     * 获取适配器
     */
    Gauge.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Gauge;
}(plot_1.Plot));
exports.Gauge = Gauge;
//# sourceMappingURL=index.js.map