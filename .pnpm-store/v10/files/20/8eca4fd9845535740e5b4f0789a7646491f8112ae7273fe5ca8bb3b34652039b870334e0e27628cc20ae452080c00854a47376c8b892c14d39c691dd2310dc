"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constants_1 = require("./constants");
require("./interactions");
var Line = /** @class */ (function (_super) {
    tslib_1.__extends(Line, _super);
    function Line() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'line';
        return _this;
    }
    /**
     * 获取 折线图 默认配置项
     * 供外部使用
     */
    Line.getDefaultOptions = function () {
        return constants_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    Line.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this, chart = _a.chart, options = _a.options;
        (0, adaptor_1.meta)({ chart: chart, options: options });
        this.chart.changeData(data);
    };
    /**
     * 获取 折线图 默认配置
     */
    Line.prototype.getDefaultOptions = function () {
        return Line.getDefaultOptions();
    };
    /**
     * 获取 折线图 的适配器
     */
    Line.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Line;
}(plot_1.Plot));
exports.Line = Line;
//# sourceMappingURL=index.js.map