"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
var utils_1 = require("./utils");
var Box = /** @class */ (function (_super) {
    tslib_1.__extends(Box, _super);
    function Box() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'box';
        return _this;
    }
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    Box.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    Box.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var yField = this.options.yField;
        var outliersView = this.chart.views.find(function (v) { return v.id === constant_1.OUTLIERS_VIEW_ID; });
        if (outliersView) {
            outliersView.data(data);
        }
        this.chart.changeData((0, utils_1.transformData)(data, yField));
    };
    /**
     * 获取 箱型图 默认配置项
     */
    Box.prototype.getDefaultOptions = function () {
        return Box.getDefaultOptions();
    };
    /**
     * 获取 箱型图 的适配器
     */
    Box.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Box;
}(plot_1.Plot));
exports.Box = Box;
//# sourceMappingURL=index.js.map