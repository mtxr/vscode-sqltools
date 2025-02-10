import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { NODE_ANCESTORS_FIELD } from '../../utils/hierarchy/util';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS, SUNBURST_ANCESTOR_FIELD, SUNBURST_PATH_FIELD } from './constant';
import './interactions';
var Sunburst = /** @class */ (function (_super) {
    __extends(Sunburst, _super);
    function Sunburst() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'sunburst';
        return _this;
    }
    /**
     * 获取 旭日图 默认配置项
     * 供外部使用
     */
    Sunburst.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * 获取 旭日图 默认配置
     */
    Sunburst.prototype.getDefaultOptions = function () {
        return Sunburst.getDefaultOptions();
    };
    /**
     * 获取旭日图的适配器
     */
    Sunburst.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    /** 旭日图 节点的祖先节点 */
    Sunburst.SUNBURST_ANCESTOR_FIELD = SUNBURST_ANCESTOR_FIELD;
    /** 旭日图 节点的路径 */
    Sunburst.SUNBURST_PATH_FIELD = SUNBURST_PATH_FIELD;
    /** 节点的祖先节点 */
    Sunburst.NODE_ANCESTORS_FIELD = NODE_ANCESTORS_FIELD;
    return Sunburst;
}(Plot));
export { Sunburst };
//# sourceMappingURL=index.js.map