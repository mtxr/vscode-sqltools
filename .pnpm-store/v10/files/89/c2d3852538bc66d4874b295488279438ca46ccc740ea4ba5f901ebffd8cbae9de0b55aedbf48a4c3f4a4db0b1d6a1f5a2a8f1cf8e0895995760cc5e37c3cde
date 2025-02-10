"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var percent_1 = require("../../utils/transform/percent");
var adaptor_1 = require("./adaptor");
var constants_1 = require("./constants");
/**
 * 柱形图
 */
var Column = /** @class */ (function (_super) {
    tslib_1.__extends(Column, _super);
    function Column() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'column';
        return _this;
    }
    /**
     * 获取 柱形图 默认配置项
     * 供外部使用
     */
    Column.getDefaultOptions = function () {
        return constants_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     */
    Column.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this.options, yField = _a.yField, xField = _a.xField, isPercent = _a.isPercent;
        var _b = this, chart = _b.chart, options = _b.options;
        (0, adaptor_1.meta)({ chart: chart, options: options });
        this.chart.changeData((0, percent_1.getDataWhetherPercentage)(data, yField, xField, yField, isPercent));
    };
    /**
     * 获取 柱形图 默认配置
     */
    Column.prototype.getDefaultOptions = function () {
        return Column.getDefaultOptions();
    };
    /**
     * 获取 柱形图 的适配器
     */
    Column.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Column;
}(plot_1.Plot));
exports.Column = Column;
//# sourceMappingURL=index.js.map