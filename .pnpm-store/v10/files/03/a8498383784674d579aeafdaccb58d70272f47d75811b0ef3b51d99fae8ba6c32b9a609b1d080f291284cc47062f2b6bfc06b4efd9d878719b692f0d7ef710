"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funnel = exports.FUNNEL_CONVERSATION_FIELD = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
Object.defineProperty(exports, "FUNNEL_CONVERSATION_FIELD", { enumerable: true, get: function () { return constant_1.FUNNEL_CONVERSATION; } });
require("./interactions");
var Funnel = /** @class */ (function (_super) {
    tslib_1.__extends(Funnel, _super);
    function Funnel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'funnel';
        return _this;
    }
    Funnel.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * 获取 漏斗图 默认配置项
     */
    Funnel.prototype.getDefaultOptions = function () {
        // 由于不同漏斗图 defaultOption 有部分逻辑不同，此处仅处理 core.getDefaultOptions 覆盖范围，funnel 的 defaulOption 为不分散逻辑统一写到 adaptor 的 defaultOption 中
        return Funnel.getDefaultOptions();
    };
    /**
     * 获取 漏斗图 的适配器
     */
    Funnel.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    /**
     * 设置状态
     * @param type 状态类型，支持 'active' | 'inactive' | 'selected' 三种
     * @param conditions 条件，支持数组
     * @param status 是否激活，默认 true
     */
    Funnel.prototype.setState = function (type, condition, status) {
        if (status === void 0) { status = true; }
        var elements = (0, utils_1.getAllElementsRecursively)(this.chart);
        (0, util_1.each)(elements, function (ele) {
            if (condition(ele.getData())) {
                ele.setState(type, status);
            }
        });
    };
    /**
     * 获取状态
     */
    Funnel.prototype.getStates = function () {
        var elements = (0, utils_1.getAllElementsRecursively)(this.chart);
        var stateObjects = [];
        (0, util_1.each)(elements, function (element) {
            var data = element.getData();
            var states = element.getStates();
            (0, util_1.each)(states, function (state) {
                stateObjects.push({ data: data, state: state, geometry: element.geometry, element: element });
            });
        });
        return stateObjects;
    };
    // 内部变量
    /** 漏斗 转化率 字段 */
    Funnel.CONVERSATION_FIELD = constant_1.FUNNEL_CONVERSATION;
    /** 漏斗 百分比 字段 */
    Funnel.PERCENT_FIELD = constant_1.FUNNEL_PERCENT;
    /** 漏斗 总转换率百分比 字段 */
    Funnel.TOTAL_PERCENT_FIELD = constant_1.FUNNEL_TOTAL_PERCENT;
    return Funnel;
}(plot_1.Plot));
exports.Funnel = Funnel;
//# sourceMappingURL=index.js.map