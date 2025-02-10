import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { getTinyData } from '../tiny-line/utils';
import { adaptor, meta } from './adaptor';
import { DEFAULT_OPTIONS } from './constants';
var TinyArea = /** @class */ (function (_super) {
    __extends(TinyArea, _super);
    function TinyArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'tiny-area';
        return _this;
    }
    /**
     * 获取默认配置项
     * 供外部使用
     */
    TinyArea.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    TinyArea.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = this, chart = _a.chart, options = _a.options;
        meta({ chart: chart, options: options });
        chart.changeData(getTinyData(data));
    };
    TinyArea.prototype.getDefaultOptions = function () {
        return TinyArea.getDefaultOptions();
    };
    /**
     * 获取 迷你面积图 的适配器
     */
    TinyArea.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return TinyArea;
}(Plot));
export { TinyArea };
//# sourceMappingURL=index.js.map