"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TinyArea = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var utils_1 = require("../tiny-line/utils");
var adaptor_1 = require("./adaptor");
var constants_1 = require("./constants");
var TinyArea = /** @class */ (function (_super) {
    tslib_1.__extends(TinyArea, _super);
    function TinyArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'tiny-area';
        return _this;
    }
    /**
     * 获取默认配置项
     * 供外部使用
     */
    TinyArea.getDefaultOptions = function () {
        return constants_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    TinyArea.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this, chart = _a.chart, options = _a.options;
        (0, adaptor_1.meta)({ chart: chart, options: options });
        chart.changeData((0, utils_1.getTinyData)(data));
    };
    TinyArea.prototype.getDefaultOptions = function () {
        return TinyArea.getDefaultOptions();
    };
    /**
     * 获取 迷你面积图 的适配器
     */
    TinyArea.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return TinyArea;
}(plot_1.Plot));
exports.TinyArea = TinyArea;
//# sourceMappingURL=index.js.map