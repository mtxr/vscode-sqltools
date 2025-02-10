import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor, meta } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
/**
 * 玉珏图
 */
var RadialBar = /** @class */ (function (_super) {
    __extends(RadialBar, _super);
    function RadialBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'radial-bar';
        return _this;
    }
    RadialBar.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    RadialBar.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        // 更新玉珏图的 scale
        meta({ chart: this.chart, options: this.options });
        this.chart.changeData(data);
    };
    /**
     * 获取默认配置
     */
    RadialBar.prototype.getDefaultOptions = function () {
        return RadialBar.getDefaultOptions();
    };
    /**
     * 获取适配器
     */
    RadialBar.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return RadialBar;
}(Plot));
export { RadialBar };
//# sourceMappingURL=index.js.map