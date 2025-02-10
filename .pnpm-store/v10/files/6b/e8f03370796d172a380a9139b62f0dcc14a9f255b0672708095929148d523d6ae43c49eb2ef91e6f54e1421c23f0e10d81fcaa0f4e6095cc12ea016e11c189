import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { deepAssign } from '../../utils';
import { adaptor } from './adaptor';
var DualAxes = /** @class */ (function (_super) {
    __extends(DualAxes, _super);
    function DualAxes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型: 双轴图 */
        _this.type = 'dual-axes';
        return _this;
    }
    /**
     * 获取 双轴图 默认配置
     */
    DualAxes.prototype.getDefaultOptions = function () {
        return deepAssign({}, _super.prototype.getDefaultOptions.call(this), {
            yAxis: [],
            syncViewPadding: true,
        });
    };
    /**
     * 获取双轴图的适配器
     */
    DualAxes.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return DualAxes;
}(Plot));
export { DualAxes };
//# sourceMappingURL=index.js.map