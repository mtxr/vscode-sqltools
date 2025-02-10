import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor, meta } from './adaptor';
import { DEFAULT_OPTIONS } from './constants';
import { getTinyData } from './utils';
var TinyLine = /** @class */ (function (_super) {
    __extends(TinyLine, _super);
    function TinyLine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'tiny-line';
        return _this;
    }
    /**
     * 获取默认配置项
     * 供外部使用
     */
    TinyLine.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    TinyLine.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this, chart = _a.chart, options = _a.options;
        meta({ chart: chart, options: options });
        chart.changeData(getTinyData(data));
    };
    TinyLine.prototype.getDefaultOptions = function () {
        return TinyLine.getDefaultOptions();
    };
    /**
     * 获取 迷你折线图 的适配器
     */
    TinyLine.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return TinyLine;
}(Plot));
export { TinyLine };
//# sourceMappingURL=index.js.map