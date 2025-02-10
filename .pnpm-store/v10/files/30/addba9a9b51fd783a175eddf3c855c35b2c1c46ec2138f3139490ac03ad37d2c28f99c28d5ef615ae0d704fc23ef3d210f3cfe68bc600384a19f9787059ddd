"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Treemap = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
require("./interactions");
var utils_1 = require("./utils");
var Treemap = /** @class */ (function (_super) {
    tslib_1.__extends(Treemap, _super);
    function Treemap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'treemap';
        return _this;
    }
    /**
     * 获取 矩阵树图 默认配置项
     * 供外部使用
     */
    Treemap.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * changeData
     */
    Treemap.prototype.changeData = function (data) {
        var _a = this.options, colorField = _a.colorField, interactions = _a.interactions, hierarchyConfig = _a.hierarchyConfig;
        this.updateOption({ data: data });
        var transData = (0, utils_1.transformData)({
            data: data,
            colorField: colorField,
            enableDrillDown: (0, utils_1.enableInteraction)(interactions, 'treemap-drill-down'),
            hierarchyConfig: hierarchyConfig,
        });
        this.chart.changeData(transData);
        (0, utils_1.resetDrillDown)(this.chart);
    };
    /**
     * 获取 矩阵树图 默认配置
     */
    Treemap.prototype.getDefaultOptions = function () {
        return Treemap.getDefaultOptions();
    };
    Treemap.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Treemap;
}(plot_1.Plot));
exports.Treemap = Treemap;
//# sourceMappingURL=index.js.map