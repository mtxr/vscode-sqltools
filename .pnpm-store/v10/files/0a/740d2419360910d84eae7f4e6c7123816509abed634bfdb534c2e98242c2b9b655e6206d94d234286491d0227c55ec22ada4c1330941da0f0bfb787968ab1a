import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS, OUTLIERS_VIEW_ID } from './constant';
import { transformData } from './utils';
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'box';
        return _this;
    }
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    Box.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    Box.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var yField = this.options.yField;
        var outliersView = this.chart.views.find(function (v) { return v.id === OUTLIERS_VIEW_ID; });
        if (outliersView) {
            outliersView.data(data);
        }
        this.chart.changeData(transformData(data, yField));
    };
    /**
     * 获取 箱型图 默认配置项
     */
    Box.prototype.getDefaultOptions = function () {
        return Box.getDefaultOptions();
    };
    /**
     * 获取 箱型图 的适配器
     */
    Box.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Box;
}(Plot));
export { Box };
//# sourceMappingURL=index.js.map