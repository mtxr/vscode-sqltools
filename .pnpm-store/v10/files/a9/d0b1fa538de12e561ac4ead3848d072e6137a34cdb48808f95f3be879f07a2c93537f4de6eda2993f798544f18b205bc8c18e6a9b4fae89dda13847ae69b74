"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Area = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var percent_1 = require("../../utils/transform/percent");
var adaptor_1 = require("./adaptor");
var constants_1 = require("./constants");
var Area = /** @class */ (function (_super) {
    tslib_1.__extends(Area, _super);
    function Area() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'area';
        return _this;
    }
    /**
     * 获取 面积图 默认配置项
     * 供外部使用
     */
    Area.getDefaultOptions = function () {
        return constants_1.DEFAULT_OPTIONS;
    };
    /**
     * 获取 面积图 默认配置
     */
    Area.prototype.getDefaultOptions = function () {
        return Area.getDefaultOptions();
    };
    /**
     * @override
     * @param data
     */
    Area.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this.options, isPercent = _a.isPercent, xField = _a.xField, yField = _a.yField;
        var _b = this, chart = _b.chart, options = _b.options;
        (0, adaptor_1.meta)({ chart: chart, options: options });
        this.chart.changeData((0, percent_1.getDataWhetherPercentage)(data, yField, xField, yField, isPercent));
    };
    /**
     * 获取 面积图 的适配器
     */
    Area.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Area;
}(plot_1.Plot));
exports.Area = Area;
//# sourceMappingURL=index.js.map