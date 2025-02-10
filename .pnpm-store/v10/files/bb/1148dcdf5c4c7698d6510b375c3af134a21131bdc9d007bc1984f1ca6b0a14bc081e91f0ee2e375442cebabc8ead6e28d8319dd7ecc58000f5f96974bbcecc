"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DualAxes = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
var adaptor_1 = require("./adaptor");
var DualAxes = /** @class */ (function (_super) {
    tslib_1.__extends(DualAxes, _super);
    function DualAxes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型: 双轴图 */
        _this.type = 'dual-axes';
        return _this;
    }
    /**
     * 获取 双轴图 默认配置
     */
    DualAxes.prototype.getDefaultOptions = function () {
        return (0, utils_1.deepAssign)({}, _super.prototype.getDefaultOptions.call(this), {
            yAxis: [],
            syncViewPadding: true,
        });
    };
    /**
     * 获取双轴图的适配器
     */
    DualAxes.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return DualAxes;
}(plot_1.Plot));
exports.DualAxes = DualAxes;
//# sourceMappingURL=index.js.map