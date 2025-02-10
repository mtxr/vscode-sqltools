import { __extends } from "tslib";
import { Event, VIEW_LIFE_CIRCLE } from '@antv/g2';
import { Plot } from '../../core/plot';
import { adaptor, statistic } from './adaptor';
import { DEFAULT_OPTIONS } from './constants';
// register liquid shape
import './shapes/liquid';
import { getLiquidData } from './utils';
export { addWaterWave } from './shapes/liquid';
/**
 * 传说中的水波图
 */
var Liquid = /** @class */ (function (_super) {
    __extends(Liquid, _super);
    function Liquid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'liquid';
        return _this;
    }
    /**
     * 获取 饼图 默认配置项
     * 供外部使用
     */
    Liquid.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * 获取 水波图 默认配置项, 供 base 获取
     */
    Liquid.prototype.getDefaultOptions = function () {
        return Liquid.getDefaultOptions();
    };
    /**
     * 更新数据
     * @param percent
     */
    Liquid.prototype.changeData = function (percent) {
        this.chart.emit(VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, Event.fromData(this.chart, VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        this.updateOption({ percent: percent });
        this.chart.data(getLiquidData(percent));
        statistic({ chart: this.chart, options: this.options }, true);
        this.chart.emit(VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, Event.fromData(this.chart, VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    /**
     * 获取适配器
     */
    Liquid.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Liquid;
}(Plot));
export { Liquid };
//# sourceMappingURL=index.js.map