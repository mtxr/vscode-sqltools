import { __extends } from "tslib";
import { Event, VIEW_LIFE_CIRCLE } from '@antv/g2';
import { Plot } from '../../core/plot';
import { adaptor, statistic } from './adaptor';
import { DEFAULT_OPTIONS, INDICATEOR_VIEW_ID, RANGE_VIEW_ID } from './constants';
// 注册 shape
import './shapes/indicator';
import './shapes/meter-gauge';
import { getIndicatorData, getRangeData } from './utils';
/**
 * 仪表盘
 */
var Gauge = /** @class */ (function (_super) {
    __extends(Gauge, _super);
    function Gauge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'gauge';
        return _this;
    }
    /**
     * 获取 仪表盘 默认配置项
     * 供外部使用
     */
    Gauge.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * 更新数据
     * @param percent
     */
    Gauge.prototype.changeData = function (percent) {
        this.chart.emit(VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, Event.fromData(this.chart, VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        this.updateOption({ percent: percent });
        var indicatorView = this.chart.views.find(function (v) { return v.id === INDICATEOR_VIEW_ID; });
        if (indicatorView) {
            indicatorView.data(getIndicatorData(percent));
        }
        var rangeView = this.chart.views.find(function (v) { return v.id === RANGE_VIEW_ID; });
        if (rangeView) {
            rangeView.data(getRangeData(percent, this.options.range));
        }
        // todo 后续让 G2 层在 afterrender 之后，来重绘 annotations
        statistic({ chart: this.chart, options: this.options }, true);
        this.chart.emit(VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, Event.fromData(this.chart, VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    /**
     * 获取默认配置
     * 供 base 使用
     */
    Gauge.prototype.getDefaultOptions = function () {
        return Gauge.getDefaultOptions();
    };
    /**
     * 获取适配器
     */
    Gauge.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Gauge;
}(Plot));
export { Gauge };
//# sourceMappingURL=index.js.map