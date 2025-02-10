"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../util");
var state_base_1 = tslib_1.__importDefault(require("./state-base"));
/**
 * 单状态量的 Action 基类
 * @class
 * @ignore
 */
var ElementSingleState = /** @class */ (function (_super) {
    tslib_1.__extends(ElementSingleState, _super);
    function ElementSingleState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElementSingleState.prototype.setStateEnable = function (enable) {
        var element = (0, util_1.getCurrentElement)(this.context);
        if (element) {
            // 在同一个 element 内部移动，忽视 label 和 shape 之间
            if (!(0, util_1.isElementChange)(this.context)) {
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
        var element = (0, util_1.getCurrentElement)(this.context);
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
}(state_base_1.default));
exports.default = ElementSingleState;
//# sourceMappingURL=single-state.js.map