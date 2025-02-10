"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var Progress = /** @class */ (function (_super) {
    tslib_1.__extends(Progress, _super);
    function Progress() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'process';
        return _this;
    }
    /**
     * 获取 仪表盘 默认配置项
     * 供外部使用
     */
    Progress.getDefaultOptions = function () {
        return constants_1.DEFAULT_OPTIONS;
    };
    /**
     * 更新数据
     * @param percent
     */
    Progress.prototype.changeData = function (percent) {
        this.updateOption({ percent: percent });
        this.chart.changeData((0, utils_1.getProgressData)(percent));
    };
    Progress.prototype.getDefaultOptions = function () {
        return Progress.getDefaultOptions();
    };
    /**
     * 获取 进度图 的适配器
     */
    Progress.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Progress;
}(plot_1.Plot));
exports.Progress = Progress;
//# sourceMappingURL=index.js.map