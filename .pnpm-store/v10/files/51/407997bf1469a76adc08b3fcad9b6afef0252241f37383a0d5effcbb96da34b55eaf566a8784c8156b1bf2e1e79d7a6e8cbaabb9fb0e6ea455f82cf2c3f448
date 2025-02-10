"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pie = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
var adaptor_1 = require("./adaptor");
var contants_1 = require("./contants");
require("./interactions");
var utils_2 = require("./utils");
var Pie = /** @class */ (function (_super) {
    tslib_1.__extends(Pie, _super);
    function Pie() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'pie';
        return _this;
    }
    /**
     * 获取 饼图 默认配置项
     * 供外部使用
     */
    Pie.getDefaultOptions = function () {
        return contants_1.DEFAULT_OPTIONS;
    };
    /**
     * 更新数据
     * @param data
     */
    Pie.prototype.changeData = function (data) {
        this.chart.emit(g2_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, g2_1.Event.fromData(this.chart, g2_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        var prevOptions = this.options;
        var angleField = this.options.angleField;
        var prevData = (0, utils_1.processIllegalData)(prevOptions.data, angleField);
        var curData = (0, utils_1.processIllegalData)(data, angleField);
        // 如果上一次或当前数据全为 0，则重新渲染
        if ((0, utils_2.isAllZero)(prevData, angleField) || (0, utils_2.isAllZero)(curData, angleField)) {
            this.update({ data: data });
        }
        else {
            this.updateOption({ data: data });
            this.chart.data(curData);
            // todo 后续让 G2 层在 afterrender 之后，来重绘 annotations
            (0, adaptor_1.pieAnnotation)({ chart: this.chart, options: this.options });
            this.chart.render(true);
        }
        this.chart.emit(g2_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, g2_1.Event.fromData(this.chart, g2_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    /**
     * 获取 饼图 默认配置项, 供 base 获取
     */
    Pie.prototype.getDefaultOptions = function () {
        return Pie.getDefaultOptions();
    };
    /**
     * 获取 饼图 的适配器
     */
    Pie.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Pie;
}(plot_1.Plot));
exports.Pie = Pie;
//# sourceMappingURL=index.js.map