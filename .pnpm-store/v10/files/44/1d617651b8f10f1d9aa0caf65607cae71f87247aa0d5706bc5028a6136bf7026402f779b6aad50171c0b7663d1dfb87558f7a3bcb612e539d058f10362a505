import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
// registered shapes
import './shapes/circle';
import './shapes/square';
var Heatmap = /** @class */ (function (_super) {
    __extends(Heatmap, _super);
    function Heatmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'heatmap';
        return _this;
    }
    /**
     * 获取 柱形图 默认配置项
     * 供外部使用
     */
    Heatmap.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * 获取直方图的适配器
     */
    Heatmap.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    /**
     * 获取 色块图 默认配置
     */
    Heatmap.prototype.getDefaultOptions = function () {
        return Heatmap.getDefaultOptions();
    };
    return Heatmap;
}(Plot));
export { Heatmap };
//# sourceMappingURL=index.js.map