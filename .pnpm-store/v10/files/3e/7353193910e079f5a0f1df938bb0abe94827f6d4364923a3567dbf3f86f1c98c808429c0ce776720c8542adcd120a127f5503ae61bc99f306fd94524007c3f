import { __extends } from "tslib";
import { Event, VIEW_LIFE_CIRCLE } from '@antv/g2';
import { Plot } from '../../core/plot';
import { processIllegalData } from '../../utils';
import { adaptor, pieAnnotation } from './adaptor';
import { DEFAULT_OPTIONS } from './contants';
import './interactions';
import { isAllZero } from './utils';
var Pie = /** @class */ (function (_super) {
    __extends(Pie, _super);
    function Pie() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'pie';
        return _this;
    }
    /**
     * 获取 饼图 默认配置项
     * 供外部使用
     */
    Pie.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * 更新数据
     * @param data
     */
    Pie.prototype.changeData = function (data) {
        this.chart.emit(VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, Event.fromData(this.chart, VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        var prevOptions = this.options;
        var angleField = this.options.angleField;
        var prevData = processIllegalData(prevOptions.data, angleField);
        var curData = processIllegalData(data, angleField);
        // 如果上一次或当前数据全为 0，则重新渲染
        if (isAllZero(prevData, angleField) || isAllZero(curData, angleField)) {
            this.update({ data: data });
        }
        else {
            this.updateOption({ data: data });
            this.chart.data(curData);
            // todo 后续让 G2 层在 afterrender 之后，来重绘 annotations
            pieAnnotation({ chart: this.chart, options: this.options });
            this.chart.render(true);
        }
        this.chart.emit(VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, Event.fromData(this.chart, VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    /**
     * 获取 饼图 默认配置项, 供 base 获取
     */
    Pie.prototype.getDefaultOptions = function () {
        return Pie.getDefaultOptions();
    };
    /**
     * 获取 饼图 的适配器
     */
    Pie.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Pie;
}(Plot));
export { Pie };
//# sourceMappingURL=index.js.map