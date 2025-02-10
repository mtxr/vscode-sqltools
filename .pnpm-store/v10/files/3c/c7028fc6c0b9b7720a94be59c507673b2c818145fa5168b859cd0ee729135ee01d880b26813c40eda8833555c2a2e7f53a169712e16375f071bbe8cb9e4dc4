"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TinyLine = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var TinyLine = /** @class */ (function (_super) {
    tslib_1.__extends(TinyLine, _super);
    function TinyLine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'tiny-line';
        return _this;
    }
    /**
     * 获取默认配置项
     * 供外部使用
     */
    TinyLine.getDefaultOptions = function () {
        return constants_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    TinyLine.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this, chart = _a.chart, options = _a.options;
        (0, adaptor_1.meta)({ chart: chart, options: options });
        chart.changeData((0, utils_1.getTinyData)(data));
    };
    TinyLine.prototype.getDefaultOptions = function () {
        return TinyLine.getDefaultOptions();
    };
    /**
     * 获取 迷你折线图 的适配器
     */
    TinyLine.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return TinyLine;
}(plot_1.Plot));
exports.TinyLine = TinyLine;
//# sourceMappingURL=index.js.map