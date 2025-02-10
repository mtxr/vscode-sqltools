"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Violin = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
var utils_1 = require("./utils");
var Violin = /** @class */ (function (_super) {
    tslib_1.__extends(Violin, _super);
    function Violin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'violin';
        return _this;
    }
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    Violin.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     */
    Violin.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        this.chart.changeData((0, utils_1.transformViolinData)(this.options));
    };
    /**
     * 获取 小提琴图 默认配置项
     */
    Violin.prototype.getDefaultOptions = function () {
        return Violin.getDefaultOptions();
    };
    /**
     * 获取 小提琴图 的适配器
     */
    Violin.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Violin;
}(plot_1.Plot));
exports.Violin = Violin;
//# sourceMappingURL=index.js.map