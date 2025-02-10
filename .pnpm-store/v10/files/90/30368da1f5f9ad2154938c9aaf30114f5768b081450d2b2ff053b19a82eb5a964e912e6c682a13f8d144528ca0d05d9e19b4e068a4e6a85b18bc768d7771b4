"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CirclePacking = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
require("./interactions");
/**
 *  CirclePacking
 * @usage hierarchy, proportions
 */
var CirclePacking = /** @class */ (function (_super) {
    tslib_1.__extends(CirclePacking, _super);
    function CirclePacking() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'circle-packing';
        return _this;
    }
    /**
     * 获取 面积图 默认配置项
     * 供外部使用
     */
    CirclePacking.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    CirclePacking.prototype.getDefaultOptions = function () {
        return CirclePacking.getDefaultOptions();
    };
    /**
     * 获取适配器
     */
    CirclePacking.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    /**
     * 覆写父类的方法
     */
    CirclePacking.prototype.triggerResize = function () {
        if (!this.chart.destroyed) {
            // 首先自适应容器的宽高
            this.chart.forceFit(); // g2 内部执行 changeSize，changeSize 中执行 render(true)
            this.chart.clear();
            this.execAdaptor(); // 核心：宽高更新之后计算padding
            // 渲染
            this.chart.render(true);
        }
    };
    return CirclePacking;
}(plot_1.Plot));
exports.CirclePacking = CirclePacking;
//# sourceMappingURL=index.js.map