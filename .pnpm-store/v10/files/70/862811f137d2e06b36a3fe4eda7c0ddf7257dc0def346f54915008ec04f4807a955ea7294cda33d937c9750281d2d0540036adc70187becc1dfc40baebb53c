"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facet = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
var Facet = /** @class */ (function (_super) {
    tslib_1.__extends(Facet, _super);
    function Facet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'area';
        return _this;
    }
    /**
     * 获取 分面图 默认配置项
     * 供外部使用
     */
    Facet.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * 获取 分面图 默认配置
     */
    Facet.prototype.getDefaultOptions = function () {
        return Facet.getDefaultOptions();
    };
    /**
     * 获取 分面图 的适配器
     */
    Facet.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Facet;
}(plot_1.Plot));
exports.Facet = Facet;
//# sourceMappingURL=index.js.map