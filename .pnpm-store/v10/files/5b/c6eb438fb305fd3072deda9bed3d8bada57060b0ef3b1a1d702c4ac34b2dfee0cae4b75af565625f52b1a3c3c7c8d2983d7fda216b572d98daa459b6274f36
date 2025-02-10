"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidirectionalBar = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
var utils_2 = require("./utils");
var BidirectionalBar = /** @class */ (function (_super) {
    tslib_1.__extends(BidirectionalBar, _super);
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
        return (0, utils_1.deepAssign)({}, _super.getDefaultOptions.call(this), {
            syncViewPadding: utils_2.syncViewPadding,
        });
    };
    /**
     * @override
     */
    BidirectionalBar.prototype.changeData = function (data) {
        if (data === void 0) { data = []; }
        this.chart.emit(g2_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, g2_1.Event.fromData(this.chart, g2_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        // 更新options
        this.updateOption({ data: data });
        var _a = this.options, xField = _a.xField, yField = _a.yField, layout = _a.layout;
        // 处理数据
        var groupData = (0, utils_2.transformData)(xField, yField, constant_1.SERIES_FIELD_KEY, data, (0, utils_2.isHorizontal)(layout));
        var firstViewData = groupData[0], secondViewData = groupData[1];
        var firstView = (0, utils_1.findViewById)(this.chart, constant_1.FIRST_AXES_VIEW);
        var secondView = (0, utils_1.findViewById)(this.chart, constant_1.SECOND_AXES_VIEW);
        // 更新对应view的data
        firstView.data(firstViewData);
        secondView.data(secondViewData);
        // 重新渲染
        this.chart.render(true);
        this.chart.emit(g2_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, g2_1.Event.fromData(this.chart, g2_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    BidirectionalBar.prototype.getDefaultOptions = function () {
        return BidirectionalBar.getDefaultOptions();
    };
    /**
     * 获取对称条形图的适配器
     */
    BidirectionalBar.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    /** 对称条形图分类字段 */
    BidirectionalBar.SERIES_FIELD_KEY = constant_1.SERIES_FIELD_KEY;
    return BidirectionalBar;
}(plot_1.Plot));
exports.BidirectionalBar = BidirectionalBar;
//# sourceMappingURL=index.js.map