import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { getDataWhetherPercentage } from '../../utils/transform/percent';
import { adaptor, meta } from './adaptor';
import { DEFAULT_OPTIONS } from './constants';
var Area = /** @class */ (function (_super) {
    __extends(Area, _super);
    function Area() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'area';
        return _this;
    }
    /**
     * 获取 面积图 默认配置项
     * 供外部使用
     */
    Area.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * 获取 面积图 默认配置
     */
    Area.prototype.getDefaultOptions = function () {
        return Area.getDefaultOptions();
    };
    /**
     * @override
     * @param data
     */
    Area.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this.options, isPercent = _a.isPercent, xField = _a.xField, yField = _a.yField;
        var _b = this, chart = _b.chart, options = _b.options;
        meta({ chart: chart, options: options });
        this.chart.changeData(getDataWhetherPercentage(data, yField, xField, yField, isPercent));
    };
    /**
     * 获取 面积图 的适配器
     */
    Area.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Area;
}(Plot));
export { Area };
//# sourceMappingURL=index.js.map