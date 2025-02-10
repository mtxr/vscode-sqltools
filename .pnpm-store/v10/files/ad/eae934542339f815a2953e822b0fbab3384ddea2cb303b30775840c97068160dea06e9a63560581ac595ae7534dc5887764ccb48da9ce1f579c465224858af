"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RingProgress = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var plot_1 = require("../../core/plot");
var utils_1 = require("../progress/utils");
var adaptor_1 = require("./adaptor");
var constants_1 = require("./constants");
var RingProgress = /** @class */ (function (_super) {
    tslib_1.__extends(RingProgress, _super);
    function RingProgress() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'ring-process';
        return _this;
    }
    /**
     * 获取默认配置项
     * 供外部使用
     */
    RingProgress.getDefaultOptions = function () {
        return constants_1.DEFAULT_OPTIONS;
    };
    /**
     * 更新数据
     * @param percent
     */
    RingProgress.prototype.changeData = function (percent) {
        this.chart.emit(g2_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, g2_1.Event.fromData(this.chart, g2_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        this.updateOption({ percent: percent });
        this.chart.data((0, utils_1.getProgressData)(percent));
        // todo 后续让 G2 层在 afterrender 之后，来重绘 annotations
        (0, adaptor_1.statistic)({ chart: this.chart, options: this.options }, true);
        this.chart.emit(g2_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, g2_1.Event.fromData(this.chart, g2_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    RingProgress.prototype.getDefaultOptions = function () {
        return RingProgress.getDefaultOptions();
    };
    /**
     * 获取 环形进度图 的适配器
     */
    RingProgress.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return RingProgress;
}(plot_1.Plot));
exports.RingProgress = RingProgress;
//# sourceMappingURL=index.js.map