import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { getDataWhetherPercentage } from '../../utils/transform/percent';
import { adaptor, meta } from './adaptor';
import { DEFAULT_OPTIONS } from './constants';
/**
 * 柱形图
 */
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    function Column() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'column';
        return _this;
    }
    /**
     * 获取 柱形图 默认配置项
     * 供外部使用
     */
    Column.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     */
    Column.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this.options, yField = _a.yField, xField = _a.xField, isPercent = _a.isPercent;
        var _b = this, chart = _b.chart, options = _b.options;
        meta({ chart: chart, options: options });
        this.chart.changeData(getDataWhetherPercentage(data, yField, xField, yField, isPercent));
    };
    /**
     * 获取 柱形图 默认配置
     */
    Column.prototype.getDefaultOptions = function () {
        return Column.getDefaultOptions();
    };
    /**
     * 获取 柱形图 的适配器
     */
    Column.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Column;
}(Plot));
export { Column };
//# sourceMappingURL=index.js.map