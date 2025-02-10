"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var percent_1 = require("../../utils/transform/percent");
var adaptor_1 = require("./adaptor");
var constants_1 = require("./constants");
/**
 * 条形图
 */
var Bar = /** @class */ (function (_super) {
    tslib_1.__extends(Bar, _super);
    function Bar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'bar';
        return _this;
    }
    /**
     * 获取 条形图 默认配置项
     * 供外部使用
     */
    Bar.getDefaultOptions = function () {
        return constants_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     */
    Bar.prototype.changeData = function (data) {
        var _a, _b;
        this.updateOption({ data: data });
        var _c = this, chart = _c.chart, options = _c.options;
        var isPercent = options.isPercent;
        var xField = options.xField, yField = options.yField, xAxis = options.xAxis, yAxis = options.yAxis;
        _a = [yField, xField], xField = _a[0], yField = _a[1];
        _b = [yAxis, xAxis], xAxis = _b[0], yAxis = _b[1];
        var switchedFieldOptions = tslib_1.__assign(tslib_1.__assign({}, options), { xField: xField, yField: yField, yAxis: yAxis, xAxis: xAxis });
        (0, adaptor_1.meta)({ chart: chart, options: switchedFieldOptions });
        chart.changeData((0, percent_1.getDataWhetherPercentage)(data, xField, yField, xField, isPercent));
    };
    /**
     * 获取 条形图 默认配置
     */
    Bar.prototype.getDefaultOptions = function () {
        return Bar.getDefaultOptions();
    };
    /**
     * 获取 条形图 的适配器
     */
    Bar.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Bar;
}(plot_1.Plot));
exports.Bar = Bar;
//# sourceMappingURL=index.js.map