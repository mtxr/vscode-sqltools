"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
var utils_1 = require("./utils");
var Stock = /** @class */ (function (_super) {
    tslib_1.__extends(Stock, _super);
    function Stock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'stock';
        return _this;
    }
    /**
     * 获取 散点图 默认配置项
     * 供外部使用
     */
    Stock.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * 默认配置
     *  g2/g2plot默 认 配 置 -->  图 表 默 认 配 置  --> 开 发 者 自 定 义 配 置  --> 最 终 绘 图 配 置
     */
    Stock.prototype.getDefaultOptions = function () {
        return Stock.getDefaultOptions();
    };
    /**
     * 获取 蜡烛图 的适配器
     */
    Stock.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    /**
     * @override
     * @param data
     */
    Stock.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var yField = this.options.yField;
        this.chart.changeData((0, utils_1.getStockData)(data, yField));
    };
    return Stock;
}(plot_1.Plot));
exports.Stock = Stock;
//# sourceMappingURL=index.js.map