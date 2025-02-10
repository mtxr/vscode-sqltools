import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
import { transformData } from './utils';
/**
 * 瀑布图
 */
var Waterfall = /** @class */ (function (_super) {
    __extends(Waterfall, _super);
    function Waterfall() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'waterfall';
        return _this;
    }
    /**
     * 获取 瀑布图 默认配置项
     * 供外部使用
     */
    Waterfall.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    Waterfall.prototype.changeData = function (data) {
        var _a = this.options, xField = _a.xField, yField = _a.yField, total = _a.total;
        this.updateOption({ data: data });
        this.chart.changeData(transformData(data, xField, yField, total));
    };
    /**
     * 获取 瀑布图 的适配器
     */
    Waterfall.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    /**
     * 获取 瀑布图 的默认配置
     */
    Waterfall.prototype.getDefaultOptions = function () {
        return Waterfall.getDefaultOptions();
    };
    return Waterfall;
}(Plot));
export { Waterfall };
//# sourceMappingURL=index.js.map