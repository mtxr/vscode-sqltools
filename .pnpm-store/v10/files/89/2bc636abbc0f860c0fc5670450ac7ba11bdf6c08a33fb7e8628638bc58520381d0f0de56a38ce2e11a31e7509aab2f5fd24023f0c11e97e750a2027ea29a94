import { __extends } from "tslib";
import { each } from '@antv/util';
import { getElements, getElementsByState } from '../util';
import { clearHighlight } from './highlight-util';
import StateAction from './state';
import { ELEMENT_STATE } from '../../../constant';
export var STATUS_UNACTIVE = ELEMENT_STATE.INACTIVE;
export var STATUS_ACTIVE = ELEMENT_STATE.ACTIVE;
/**
 * @ignore
 * highlight，指定图形高亮，其他图形变暗
 */
var ElementHighlight = /** @class */ (function (_super) {
    __extends(ElementHighlight, _super);
    function ElementHighlight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stateName = STATUS_ACTIVE;
        return _this;
    }
    // 多个元素设置、取消 highlight
    ElementHighlight.prototype.setElementsStateByItem = function (elements, field, item, enable) {
        var _this = this;
        var callback = function (el) { return _this.isMathItem(el, field, item); };
        this.setHighlightBy(elements, callback, enable);
    };
    // 设置元素的 highlight
    ElementHighlight.prototype.setElementHighlight = function (el, callback) {
        if (callback(el)) {
            if (el.hasState(STATUS_UNACTIVE)) {
                el.setState(STATUS_UNACTIVE, false);
            }
            el.setState(STATUS_ACTIVE, true);
        }
        else if (!el.hasState(STATUS_ACTIVE)) {
            el.setState(STATUS_UNACTIVE, true);
        }
    };
    ElementHighlight.prototype.setHighlightBy = function (elements, callback, enable) {
        var _this = this;
        if (enable) {
            // 如果是设置 highlight ，则将匹配的 element 设置成 active，
            // 其他如果不是 active，则设置成 unactive
            each(elements, function (el) {
                _this.setElementHighlight(el, callback);
            });
        }
        else {
            // 如果取消 highlight，则要检测是否全部取消 highlight
            var activeElements = getElementsByState(this.context.view, STATUS_ACTIVE);
            var allCancel_1 = true;
            // 检测所有 activeElements 都要取消 highlight
            each(activeElements, function (el) {
                if (!callback(el)) {
                    allCancel_1 = false;
                    return false;
                }
            });
            if (allCancel_1) {
                // 都要取消，则取消所有的 active，unactive 状态
                this.clear();
            }
            else {
                // 如果不是都要取消 highlight, 则设置匹配的 element 的状态为 unactive
                // 其他 element 状态不变
                each(elements, function (el) {
                    if (callback(el)) {
                        if (el.hasState(STATUS_ACTIVE)) {
                            el.setState(STATUS_ACTIVE, false);
                        }
                        el.setState(STATUS_UNACTIVE, true);
                    }
                });
            }
        }
    };
    // 单个元素设置和取消 highlight
    ElementHighlight.prototype.setElementState = function (element, enable) {
        var view = this.context.view;
        var elements = getElements(view);
        this.setHighlightBy(elements, function (el) { return element === el; }, enable);
    };
    ElementHighlight.prototype.highlight = function () {
        this.setState();
    };
    // 清理掉所有的 active， unactive 状态
    ElementHighlight.prototype.clear = function () {
        var view = this.context.view;
        clearHighlight(view);
    };
    return ElementHighlight;
}(StateAction));
export default ElementHighlight;
//# sourceMappingURL=highlight.js.map