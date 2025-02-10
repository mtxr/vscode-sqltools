"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sunburst = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var util_1 = require("../../utils/hierarchy/util");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
require("./interactions");
var Sunburst = /** @class */ (function (_super) {
    tslib_1.__extends(Sunburst, _super);
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
        return constant_1.DEFAULT_OPTIONS;
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
        return adaptor_1.adaptor;
    };
    /** 旭日图 节点的祖先节点 */
    Sunburst.SUNBURST_ANCESTOR_FIELD = constant_1.SUNBURST_ANCESTOR_FIELD;
    /** 旭日图 节点的路径 */
    Sunburst.SUNBURST_PATH_FIELD = constant_1.SUNBURST_PATH_FIELD;
    /** 节点的祖先节点 */
    Sunburst.NODE_ANCESTORS_FIELD = util_1.NODE_ANCESTORS_FIELD;
    return Sunburst;
}(plot_1.Plot));
exports.Sunburst = Sunburst;
//# sourceMappingURL=index.js.map