import { __assign, __extends } from "tslib";
import { BRUSH_FILTER_EVENTS, VIEW_LIFE_CIRCLE } from '@antv/g2';
import { Plot } from '../../core/plot';
import { deepAssign } from '../../utils';
import { adaptor, meta, transformOptions } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
import './interactions';
var Scatter = /** @class */ (function (_super) {
    __extends(Scatter, _super);
    function Scatter(container, options) {
        var _this = _super.call(this, container, options) || this;
        /** 图表类型 */
        _this.type = 'scatter';
        // 监听 brush 事件，处理 meta
        _this.on(VIEW_LIFE_CIRCLE.BEFORE_RENDER, function (evt) {
            var _a, _b;
            // 运行时，读取 option
            var _c = _this, options = _c.options, chart = _c.chart;
            if (((_a = evt.data) === null || _a === void 0 ? void 0 : _a.source) === BRUSH_FILTER_EVENTS.FILTER) {
                var filteredData = _this.chart.filterData(_this.chart.getData());
                meta({ chart: chart, options: __assign(__assign({}, options), { data: filteredData }) });
            }
            if (((_b = evt.data) === null || _b === void 0 ? void 0 : _b.source) === BRUSH_FILTER_EVENTS.RESET) {
                meta({ chart: chart, options: options });
            }
        });
        return _this;
    }
    /**
     * 获取 散点图 默认配置项
     * 供外部使用
     */
    Scatter.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    Scatter.prototype.changeData = function (data) {
        this.updateOption(transformOptions(deepAssign({}, this.options, { data: data })));
        var _a = this, options = _a.options, chart = _a.chart;
        meta({ chart: chart, options: options });
        this.chart.changeData(data);
    };
    /**
     * 获取 散点图 的适配器
     */
    Scatter.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    Scatter.prototype.getDefaultOptions = function () {
        return Scatter.getDefaultOptions();
    };
    return Scatter;
}(Plot));
export { Scatter };
//# sourceMappingURL=index.js.map