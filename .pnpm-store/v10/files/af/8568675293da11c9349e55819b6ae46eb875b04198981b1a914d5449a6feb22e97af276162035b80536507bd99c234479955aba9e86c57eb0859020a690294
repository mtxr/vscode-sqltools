import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
import { getStockData } from './utils';
var Stock = /** @class */ (function (_super) {
    __extends(Stock, _super);
    function Stock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'stock';
        return _this;
    }
    /**
     * 获取 散点图 默认配置项
     * 供外部使用
     */
    Stock.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * 默认配置
     *  g2/g2plot默 认 配 置 -->  图 表 默 认 配 置  --> 开 发 者 自 定 义 配 置  --> 最 终 绘 图 配 置
     */
    Stock.prototype.getDefaultOptions = function () {
        return Stock.getDefaultOptions();
    };
    /**
     * 获取 蜡烛图 的适配器
     */
    Stock.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    /**
     * @override
     * @param data
     */
    Stock.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var yField = this.options.yField;
        this.chart.changeData(getStockData(data, yField));
    };
    return Stock;
}(Plot));
export { Stock };
//# sourceMappingURL=index.js.map