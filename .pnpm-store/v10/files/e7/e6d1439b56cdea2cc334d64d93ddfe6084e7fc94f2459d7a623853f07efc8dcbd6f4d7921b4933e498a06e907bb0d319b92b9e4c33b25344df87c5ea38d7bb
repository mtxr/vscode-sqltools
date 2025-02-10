import { __extends } from "tslib";
import { Event, VIEW_LIFE_CIRCLE } from '@antv/g2';
import { Plot } from '../../core/plot';
import { getProgressData } from '../progress/utils';
import { adaptor, statistic } from './adaptor';
import { DEFAULT_OPTIONS } from './constants';
var RingProgress = /** @class */ (function (_super) {
    __extends(RingProgress, _super);
    function RingProgress() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'ring-process';
        return _this;
    }
    /**
     * 获取默认配置项
     * 供外部使用
     */
    RingProgress.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * 更新数据
     * @param percent
     */
    RingProgress.prototype.changeData = function (percent) {
        this.chart.emit(VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, Event.fromData(this.chart, VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        this.updateOption({ percent: percent });
        this.chart.data(getProgressData(percent));
        // todo 后续让 G2 层在 afterrender 之后，来重绘 annotations
        statistic({ chart: this.chart, options: this.options }, true);
        this.chart.emit(VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, Event.fromData(this.chart, VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    RingProgress.prototype.getDefaultOptions = function () {
        return RingProgress.getDefaultOptions();
    };
    /**
     * 获取 环形进度图 的适配器
     */
    RingProgress.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return RingProgress;
}(Plot));
export { RingProgress };
//# sourceMappingURL=index.js.map