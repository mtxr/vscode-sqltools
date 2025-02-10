import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor, meta } from './adaptor';
import { DEFAULT_OPTIONS } from './constants';
import './interactions';
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'line';
        return _this;
    }
    /**
     * 获取 折线图 默认配置项
     * 供外部使用
     */
    Line.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    Line.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this, chart = _a.chart, options = _a.options;
        meta({ chart: chart, options: options });
        this.chart.changeData(data);
    };
    /**
     * 获取 折线图 默认配置
     */
    Line.prototype.getDefaultOptions = function () {
        return Line.getDefaultOptions();
    };
    /**
     * 获取 折线图 的适配器
     */
    Line.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Line;
}(Plot));
export { Line };
//# sourceMappingURL=index.js.map