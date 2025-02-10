"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Liquid = exports.addWaterWave = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constants_1 = require("./constants");
// register liquid shape
require("./shapes/liquid");
var utils_1 = require("./utils");
var liquid_1 = require("./shapes/liquid");
Object.defineProperty(exports, "addWaterWave", { enumerable: true, get: function () { return liquid_1.addWaterWave; } });
/**
 * 传说中的水波图
 */
var Liquid = /** @class */ (function (_super) {
    tslib_1.__extends(Liquid, _super);
    function Liquid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'liquid';
        return _this;
    }
    /**
     * 获取 饼图 默认配置项
     * 供外部使用
     */
    Liquid.getDefaultOptions = function () {
        return constants_1.DEFAULT_OPTIONS;
    };
    /**
     * 获取 水波图 默认配置项, 供 base 获取
     */
    Liquid.prototype.getDefaultOptions = function () {
        return Liquid.getDefaultOptions();
    };
    /**
     * 更新数据
     * @param percent
     */
    Liquid.prototype.changeData = function (percent) {
        this.chart.emit(g2_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, g2_1.Event.fromData(this.chart, g2_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        this.updateOption({ percent: percent });
        this.chart.data((0, utils_1.getLiquidData)(percent));
        (0, adaptor_1.statistic)({ chart: this.chart, options: this.options }, true);
        this.chart.emit(g2_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, g2_1.Event.fromData(this.chart, g2_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    /**
     * 获取适配器
     */
    Liquid.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Liquid;
}(plot_1.Plot));
exports.Liquid = Liquid;
//# sourceMappingURL=index.js.map