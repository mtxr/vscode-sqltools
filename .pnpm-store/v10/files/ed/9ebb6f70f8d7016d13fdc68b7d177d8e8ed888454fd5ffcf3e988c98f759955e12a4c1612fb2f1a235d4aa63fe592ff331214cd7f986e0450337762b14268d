import { __extends } from "tslib";
import { Event, VIEW_LIFE_CIRCLE } from '@antv/g2';
import { Plot } from '../../core/plot';
import { deepAssign, findViewById } from '../../utils';
import { adaptor } from './adaptor';
import { FIRST_AXES_VIEW, SECOND_AXES_VIEW, SERIES_FIELD_KEY } from './constant';
import { isHorizontal, syncViewPadding, transformData } from './utils';
var BidirectionalBar = /** @class */ (function (_super) {
    __extends(BidirectionalBar, _super);
    function BidirectionalBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'bidirectional-bar';
        return _this;
    }
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    BidirectionalBar.getDefaultOptions = function () {
        return deepAssign({}, _super.getDefaultOptions.call(this), {
            syncViewPadding: syncViewPadding,
        });
    };
    /**
     * @override
     */
    BidirectionalBar.prototype.changeData = function (data) {
        if (data === void 0) { data = []; }
        this.chart.emit(VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, Event.fromData(this.chart, VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        // 更新options
        this.updateOption({ data: data });
        var _a = this.options, xField = _a.xField, yField = _a.yField, layout = _a.layout;
        // 处理数据
        var groupData = transformData(xField, yField, SERIES_FIELD_KEY, data, isHorizontal(layout));
        var firstViewData = groupData[0], secondViewData = groupData[1];
        var firstView = findViewById(this.chart, FIRST_AXES_VIEW);
        var secondView = findViewById(this.chart, SECOND_AXES_VIEW);
        // 更新对应view的data
        firstView.data(firstViewData);
        secondView.data(secondViewData);
        // 重新渲染
        this.chart.render(true);
        this.chart.emit(VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, Event.fromData(this.chart, VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    BidirectionalBar.prototype.getDefaultOptions = function () {
        return BidirectionalBar.getDefaultOptions();
    };
    /**
     * 获取对称条形图的适配器
     */
    BidirectionalBar.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    /** 对称条形图分类字段 */
    BidirectionalBar.SERIES_FIELD_KEY = SERIES_FIELD_KEY;
    return BidirectionalBar;
}(Plot));
export { BidirectionalBar };
//# sourceMappingURL=index.js.map