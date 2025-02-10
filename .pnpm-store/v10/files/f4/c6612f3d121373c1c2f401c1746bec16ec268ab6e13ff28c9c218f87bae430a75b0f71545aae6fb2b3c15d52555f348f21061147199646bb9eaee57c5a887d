"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadialBar = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
/**
 * 玉珏图
 */
var RadialBar = /** @class */ (function (_super) {
    tslib_1.__extends(RadialBar, _super);
    function RadialBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'radial-bar';
        return _this;
    }
    RadialBar.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    RadialBar.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        // 更新玉珏图的 scale
        (0, adaptor_1.meta)({ chart: this.chart, options: this.options });
        this.chart.changeData(data);
    };
    /**
     * 获取默认配置
     */
    RadialBar.prototype.getDefaultOptions = function () {
        return RadialBar.getDefaultOptions();
    };
    /**
     * 获取适配器
     */
    RadialBar.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return RadialBar;
}(plot_1.Plot));
exports.RadialBar = RadialBar;
//# sourceMappingURL=index.js.map