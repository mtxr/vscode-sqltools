import { __extends } from "tslib";
import { each } from '@antv/util';
import { getElements, getIntersectElements, getMaskedElements, getSiblingMaskElements, getSilbings, isInRecords, isMask, } from '../util';
import StateBase from './state-base';
/**
 * @ignore
 * 区域设置状态的基础 Action
 */
var ElementRangeState = /** @class */ (function (_super) {
    __extends(ElementRangeState, _super);
    function ElementRangeState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startPoint = null;
        _this.endPoint = null;
        _this.isStarted = false;
        /**
         * 是否作用于当前 view 的 siblings，默认是 false 仅作用于自己
         */
        _this.effectSiblings = false;
        /**
         * 是否受 element 的数据影响，还是受包围盒的影响
         */
        _this.effectByRecord = false;
        return _this;
    }
    // 获取当前的位置
    ElementRangeState.prototype.getCurrentPoint = function () {
        var event = this.context.event;
        return {
            x: event.x,
            y: event.y,
        };
    };
    /**
     * 开始，记录开始选中的位置
     */
    ElementRangeState.prototype.start = function () {
        this.clear(); // 开始的时候清理之前的状态
        this.startPoint = this.getCurrentPoint();
        this.isStarted = true;
    };
    ElementRangeState.prototype.getIntersectElements = function () {
        var elements = null;
        if (isMask(this.context)) {
            elements = getMaskedElements(this.context, 10);
        }
        else {
            var startPoint = this.startPoint;
            var endPoint = this.isStarted ? this.getCurrentPoint() : this.endPoint;
            // 如果没有开始，则不允许范围设置状态，保护性质
            if (!startPoint || !endPoint) {
                return;
            }
            // 计算框选区域
            var box = {
                minX: Math.min(startPoint.x, endPoint.x),
                minY: Math.min(startPoint.y, endPoint.y),
                maxX: Math.max(startPoint.x, endPoint.x),
                maxY: Math.max(startPoint.y, endPoint.y),
            };
            // this.clear(); // 不全部清理，会导致闪烁
            var view = this.context.view;
            elements = getIntersectElements(view, box);
        }
        return elements;
    };
    /**
     * 选中
     */
    ElementRangeState.prototype.setStateEnable = function (enable) {
        if (this.effectSiblings && !this.effectByRecord) {
            this.setSiblingsState(enable);
        }
        else {
            var allElements = getElements(this.context.view);
            var elements = this.getIntersectElements();
            if (elements && elements.length) {
                if (this.effectByRecord) {
                    this.setSiblingsStateByRecord(elements, enable);
                }
                else {
                    this.setElementsState(elements, enable, allElements);
                }
            }
            else {
                this.clear();
            }
        }
    };
    // 根据选中的 element 的数据进行设置状态
    ElementRangeState.prototype.setSiblingsStateByRecord = function (elements, enable) {
        var _this = this;
        var view = this.context.view;
        var siblings = getSilbings(view);
        var records = elements.map(function (el) {
            return el.getModel().data;
        });
        var xFiled = view.getXScale().field;
        var yField = view.getYScales()[0].field;
        each(siblings, function (sibling) {
            var allElements = getElements(sibling);
            var effectElements = allElements.filter(function (el) {
                var record = el.getModel().data;
                return isInRecords(records, record, xFiled, yField);
            });
            _this.setElementsState(effectElements, enable, allElements);
        });
    };
    // 设置兄弟 view 的状态
    ElementRangeState.prototype.setSiblingsState = function (enable) {
        var _this = this;
        var view = this.context.view;
        var siblings = getSilbings(view);
        if (isMask(this.context)) {
            // 受 mask 影响
            each(siblings, function (sibling) {
                var allElements = getElements(sibling);
                var effectElements = getSiblingMaskElements(_this.context, sibling, 10);
                if (effectElements && effectElements.length) {
                    _this.setElementsState(effectElements, enable, allElements);
                }
                else {
                    _this.clearViewState(sibling);
                }
            });
        }
    };
    ElementRangeState.prototype.setElementsState = function (elements, enable, allElements) {
        var _this = this;
        each(allElements, function (el) {
            if (!elements.includes(el)) {
                _this.setElementState(el, false);
            }
            else {
                _this.setElementState(el, enable);
            }
        });
    };
    /**
     * 结束
     */
    ElementRangeState.prototype.end = function () {
        this.isStarted = false;
        this.endPoint = this.getCurrentPoint();
    };
    // 复写 clear
    ElementRangeState.prototype.clear = function () {
        var _this = this;
        var view = this.context.view;
        // 判断是否影响 siblings
        if (this.effectSiblings) {
            var siblings = getSilbings(view);
            each(siblings, function (sibling) {
                _this.clearViewState(sibling);
            });
        }
        else {
            this.clearViewState(view);
        }
    };
    return ElementRangeState;
}(StateBase));
export default ElementRangeState;
//# sourceMappingURL=range-state.js.map