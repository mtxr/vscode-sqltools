"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Waterfall = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
var utils_1 = require("./utils");
/**
 * 瀑布图
 */
var Waterfall = /** @class */ (function (_super) {
    tslib_1.__extends(Waterfall, _super);
    function Waterfall() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'waterfall';
        return _this;
    }
    /**
     * 获取 瀑布图 默认配置项
     * 供外部使用
     */
    Waterfall.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    Waterfall.prototype.changeData = function (data) {
        var _a = this.options, xField = _a.xField, yField = _a.yField, total = _a.total;
        this.updateOption({ data: data });
        this.chart.changeData((0, utils_1.transformData)(data, xField, yField, total));
    };
    /**
     * 获取 瀑布图 的适配器
     */
    Waterfall.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    /**
     * 获取 瀑布图 的默认配置
     */
    Waterfall.prototype.getDefaultOptions = function () {
        return Waterfall.getDefaultOptions();
    };
    return Waterfall;
}(plot_1.Plot));
exports.Waterfall = Waterfall;
//# sourceMappingURL=index.js.map