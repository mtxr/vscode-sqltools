import { __assign, __extends } from "tslib";
import { Plot } from '../../core/plot';
import { getDataWhetherPercentage } from '../../utils/transform/percent';
import { adaptor, meta } from './adaptor';
import { DEFAULT_OPTIONS } from './constants';
/**
 * 条形图
 */
var Bar = /** @class */ (function (_super) {
    __extends(Bar, _super);
    function Bar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'bar';
        return _this;
    }
    /**
     * 获取 条形图 默认配置项
     * 供外部使用
     */
    Bar.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     */
    Bar.prototype.changeData = function (data) {
        var _a, _b;
        this.updateOption({ data: data });
        var _c = this, chart = _c.chart, options = _c.options;
        var isPercent = options.isPercent;
        var xField = options.xField, yField = options.yField, xAxis = options.xAxis, yAxis = options.yAxis;
        _a = [yField, xField], xField = _a[0], yField = _a[1];
        _b = [yAxis, xAxis], xAxis = _b[0], yAxis = _b[1];
        var switchedFieldOptions = __assign(__assign({}, options), { xField: xField, yField: yField, yAxis: yAxis, xAxis: xAxis });
        meta({ chart: chart, options: switchedFieldOptions });
        chart.changeData(getDataWhetherPercentage(data, xField, yField, xField, isPercent));
    };
    /**
     * 获取 条形图 默认配置
     */
    Bar.prototype.getDefaultOptions = function () {
        return Bar.getDefaultOptions();
    };
    /**
     * 获取 条形图 的适配器
     */
    Bar.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Bar;
}(Plot));
export { Bar };
//# sourceMappingURL=index.js.map