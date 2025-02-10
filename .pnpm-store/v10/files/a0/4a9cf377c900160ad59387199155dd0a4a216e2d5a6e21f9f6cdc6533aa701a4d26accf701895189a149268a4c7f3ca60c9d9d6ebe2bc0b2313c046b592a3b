import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
var Facet = /** @class */ (function (_super) {
    __extends(Facet, _super);
    function Facet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'area';
        return _this;
    }
    /**
     * 获取 分面图 默认配置项
     * 供外部使用
     */
    Facet.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * 获取 分面图 默认配置
     */
    Facet.prototype.getDefaultOptions = function () {
        return Facet.getDefaultOptions();
    };
    /**
     * 获取 分面图 的适配器
     */
    Facet.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Facet;
}(Plot));
export { Facet };
//# sourceMappingURL=index.js.map