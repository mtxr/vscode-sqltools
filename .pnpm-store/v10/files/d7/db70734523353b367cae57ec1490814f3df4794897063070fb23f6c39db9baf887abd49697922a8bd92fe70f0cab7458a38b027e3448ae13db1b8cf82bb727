"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = tslib_1.__importDefault(require("../base"));
var util_2 = require("../util");
/**
 * 状态量 Action 的基类
 * @abstract
 * @class
 * @ignore
 */
var StateBase = /** @class */ (function (_super) {
    tslib_1.__extends(StateBase, _super);
    function StateBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 状态名称
         */
        _this.stateName = '';
        return _this;
    }
    /**
     * 是否具有某个状态
     * @param element 图表 Element 元素
     */
    StateBase.prototype.hasState = function (element) {
        return element.hasState(this.stateName);
    };
    /**
     * 设置状态激活
     * @param enable 状态值
     */
    StateBase.prototype.setElementState = function (element, enable) {
        // 防止闪烁
        element.setState(this.stateName, enable);
    };
    /**
     * 设置状态
     */
    StateBase.prototype.setState = function () {
        this.setStateEnable(true);
    };
    /**
     * 清除所有 Element 的状态
     */
    StateBase.prototype.clear = function () {
        var view = this.context.view;
        this.clearViewState(view);
    };
    StateBase.prototype.clearViewState = function (view) {
        var _this = this;
        var elements = (0, util_2.getElementsByState)(view, this.stateName);
        (0, util_1.each)(elements, function (el) {
            _this.setElementState(el, false);
        });
    };
    return StateBase;
}(base_1.default));
exports.default = StateBase;
//# sourceMappingURL=state-base.js.map