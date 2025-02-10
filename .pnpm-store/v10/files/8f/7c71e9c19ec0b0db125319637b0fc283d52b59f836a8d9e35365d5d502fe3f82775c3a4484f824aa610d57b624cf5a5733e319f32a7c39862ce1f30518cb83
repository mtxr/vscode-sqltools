import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
/**
 * 这个是一个图表开发的 模板代码！
 */
var Venn = /** @class */ (function (_super) {
    __extends(Venn, _super);
    function Venn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'venn';
        return _this;
    }
    Venn.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
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
        return adaptor;
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
}(Plot));
export { Venn };
//# sourceMappingURL=index.js.map