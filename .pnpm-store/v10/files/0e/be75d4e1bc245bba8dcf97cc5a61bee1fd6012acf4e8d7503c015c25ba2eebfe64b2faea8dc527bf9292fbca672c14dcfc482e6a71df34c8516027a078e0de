"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venn = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
/**
 * 这个是一个图表开发的 模板代码！
 */
var Venn = /** @class */ (function (_super) {
    tslib_1.__extends(Venn, _super);
    function Venn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'venn';
        return _this;
    }
    Venn.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * 获取 韦恩图 默认配置
     */
    Venn.prototype.getDefaultOptions = function () {
        return Venn.getDefaultOptions();
    };
    /**
     * 获取适配器
     */
    Venn.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    /**
     * 覆写父类的方法
     */
    Venn.prototype.triggerResize = function () {
        if (!this.chart.destroyed) {
            // 首先自适应容器的宽高
            this.chart.forceFit(); // g2 内部执行 changeSize，changeSize 中执行 render(true)
            this.chart.clear();
            this.execAdaptor(); // 核心：宽高更新之后计算布局
            // 渲染
            this.chart.render(true);
        }
    };
    return Venn;
}(plot_1.Plot));
exports.Venn = Venn;
//# sourceMappingURL=index.js.map