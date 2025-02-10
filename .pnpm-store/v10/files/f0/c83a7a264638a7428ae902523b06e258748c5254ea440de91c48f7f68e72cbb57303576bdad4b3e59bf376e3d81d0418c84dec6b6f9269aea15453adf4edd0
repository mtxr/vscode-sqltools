import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { getTinyData } from '../tiny-line/utils';
import { adaptor, meta } from './adaptor';
import { DEFAULT_OPTIONS } from './constants';
var TinyColumn = /** @class */ (function (_super) {
    __extends(TinyColumn, _super);
    function TinyColumn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'tiny-column';
        return _this;
    }
    /**
     * 获取默认配置项
     * 供外部使用
     */
    TinyColumn.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    TinyColumn.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this, chart = _a.chart, options = _a.options;
        meta({ chart: chart, options: options });
        chart.changeData(getTinyData(data));
    };
    TinyColumn.prototype.getDefaultOptions = function () {
        return TinyColumn.getDefaultOptions();
    };
    /**
     * 获取 迷你柱形图 的适配器
     */
    TinyColumn.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return TinyColumn;
}(Plot));
export { TinyColumn };
//# sourceMappingURL=index.js.map