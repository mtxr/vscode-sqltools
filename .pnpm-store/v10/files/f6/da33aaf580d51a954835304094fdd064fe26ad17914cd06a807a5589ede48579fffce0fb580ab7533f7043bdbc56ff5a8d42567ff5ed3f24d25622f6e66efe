import { __extends } from "tslib";
import { getCurrentElement, isElementChange } from '../util';
import StateBase from './state-base';
/**
 * 单状态量的 Action 基类
 * @class
 * @ignore
 */
var ElementSingleState = /** @class */ (function (_super) {
    __extends(ElementSingleState, _super);
    function ElementSingleState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElementSingleState.prototype.setStateEnable = function (enable) {
        var element = getCurrentElement(this.context);
        if (element) {
            // 在同一个 element 内部移动，忽视 label 和 shape 之间
            if (!isElementChange(this.context)) {
                return;
            }
            // 仅支持单个状态量的元素，只能由 element 触发
            if (enable) {
                this.clear();
                this.setElementState(element, true);
            }
            else if (this.hasState(element)) {
                this.setElementState(element, false);
            }
        }
    };
    /**
     * 切换选中，只允许选中一个
     */
    ElementSingleState.prototype.toggle = function () {
        var element = getCurrentElement(this.context);
        if (element) {
            var hasState = this.hasState(element); // 提前获取状态
            if (!hasState) {
                this.clear();
            }
            this.setElementState(element, !hasState);
        }
    };
    /**
     * 取消当前时间影响的状态
     */
    ElementSingleState.prototype.reset = function () {
        this.setStateEnable(false);
    };
    return ElementSingleState;
}(StateBase));
export default ElementSingleState;
//# sourceMappingURL=single-state.js.map