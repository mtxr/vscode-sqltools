import { __extends } from "tslib";
import { each } from '@antv/util';
import Action from '../base';
import { getElementsByState } from '../util';
/**
 * 状态量 Action 的基类
 * @abstract
 * @class
 * @ignore
 */
var StateBase = /** @class */ (function (_super) {
    __extends(StateBase, _super);
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
        var elements = getElementsByState(view, this.stateName);
        each(elements, function (el) {
            _this.setElementState(el, false);
        });
    };
    return StateBase;
}(Action));
export default StateBase;
//# sourceMappingURL=state-base.js.map