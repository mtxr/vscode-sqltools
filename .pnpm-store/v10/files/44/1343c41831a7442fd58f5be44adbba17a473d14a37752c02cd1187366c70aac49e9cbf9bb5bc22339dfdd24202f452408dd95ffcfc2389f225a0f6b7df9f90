import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
import './interactions';
import { enableInteraction, resetDrillDown, transformData } from './utils';
var Treemap = /** @class */ (function (_super) {
    __extends(Treemap, _super);
    function Treemap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'treemap';
        return _this;
    }
    /**
     * 获取 矩阵树图 默认配置项
     * 供外部使用
     */
    Treemap.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * changeData
     */
    Treemap.prototype.changeData = function (data) {
        var _a = this.options, colorField = _a.colorField, interactions = _a.interactions, hierarchyConfig = _a.hierarchyConfig;
        this.updateOption({ data: data });
        var transData = transformData({
            data: data,
            colorField: colorField,
            enableDrillDown: enableInteraction(interactions, 'treemap-drill-down'),
            hierarchyConfig: hierarchyConfig,
        });
        this.chart.changeData(transData);
        resetDrillDown(this.chart);
    };
    /**
     * 获取 矩阵树图 默认配置
     */
    Treemap.prototype.getDefaultOptions = function () {
        return Treemap.getDefaultOptions();
    };
    Treemap.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Treemap;
}(Plot));
export { Treemap };
//# sourceMappingURL=index.js.map