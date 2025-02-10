"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mix = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
require("./interactions");
/**
 * 多图层图形，释放 G2 80% 的功能，可以用来做：
 * 1. 图层叠加的图：
 *   - 折线 + 置信度区间迭代
 *   - 嵌套饼图
 *   - ...
 * 2. 图层划分的图
 *   - 多维图
 *   - 柱饼组合图
 *   - ...
 */
var Mix = /** @class */ (function (_super) {
    tslib_1.__extends(Mix, _super);
    function Mix() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'mix';
        return _this;
    }
    /**
     * 获取适配器
     */
    Mix.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Mix;
}(plot_1.Plot));
exports.Mix = Mix;
//# sourceMappingURL=index.js.map