"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scatter = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
require("./interactions");
var Scatter = /** @class */ (function (_super) {
    tslib_1.__extends(Scatter, _super);
    function Scatter(container, options) {
        var _this = _super.call(this, container, options) || this;
        /** 图表类型 */
        _this.type = 'scatter';
        // 监听 brush 事件，处理 meta
        _this.on(g2_1.VIEW_LIFE_CIRCLE.BEFORE_RENDER, function (evt) {
            var _a, _b;
            // 运行时，读取 option
            var _c = _this, options = _c.options, chart = _c.chart;
            if (((_a = evt.data) === null || _a === void 0 ? void 0 : _a.source) === g2_1.BRUSH_FILTER_EVENTS.FILTER) {
                var filteredData = _this.chart.filterData(_this.chart.getData());
                (0, adaptor_1.meta)({ chart: chart, options: tslib_1.__assign(tslib_1.__assign({}, options), { data: filteredData }) });
            }
            if (((_b = evt.data) === null || _b === void 0 ? void 0 : _b.source) === g2_1.BRUSH_FILTER_EVENTS.RESET) {
                (0, adaptor_1.meta)({ chart: chart, options: options });
            }
        });
        return _this;
    }
    /**
     * 获取 散点图 默认配置项
     * 供外部使用
     */
    Scatter.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    Scatter.prototype.changeData = function (data) {
        this.updateOption((0, adaptor_1.transformOptions)((0, utils_1.deepAssign)({}, this.options, { data: data })));
        var _a = this, options = _a.options, chart = _a.chart;
        (0, adaptor_1.meta)({ chart: chart, options: options });
        this.chart.changeData(data);
    };
    /**
     * 获取 散点图 的适配器
     */
    Scatter.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    Scatter.prototype.getDefaultOptions = function () {
        return Scatter.getDefaultOptions();
    };
    return Scatter;
}(plot_1.Plot));
exports.Scatter = Scatter;
//# sourceMappingURL=index.js.map