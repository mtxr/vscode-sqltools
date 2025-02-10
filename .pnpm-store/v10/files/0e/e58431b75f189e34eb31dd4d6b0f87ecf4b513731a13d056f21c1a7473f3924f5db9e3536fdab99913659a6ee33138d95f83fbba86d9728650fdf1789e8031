import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { binHistogram } from '../../utils/transform/histogram';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
var Histogram = /** @class */ (function (_super) {
    __extends(Histogram, _super);
    function Histogram() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'histogram';
        return _this;
    }
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    Histogram.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    Histogram.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this.options, binField = _a.binField, binNumber = _a.binNumber, binWidth = _a.binWidth, stackField = _a.stackField;
        this.chart.changeData(binHistogram(data, binField, binWidth, binNumber, stackField));
    };
    /**
     * 获取直方图的适配器
     */
    Histogram.prototype.getDefaultOptions = function () {
        return Histogram.getDefaultOptions();
    };
    /**
     * 获取直方图的适配器
     */
    Histogram.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Histogram;
}(Plot));
export { Histogram };
//# sourceMappingURL=index.js.map