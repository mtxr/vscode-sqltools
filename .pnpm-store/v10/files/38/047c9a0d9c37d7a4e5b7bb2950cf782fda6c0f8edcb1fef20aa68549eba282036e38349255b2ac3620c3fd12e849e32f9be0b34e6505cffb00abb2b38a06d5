import { __extends } from "tslib";
import { Event } from '../../../chart';
import { clearHighlight, setHighlightBy } from './highlight-util';
import ElementRangeState from './range-state';
var EVENTS;
(function (EVENTS) {
    EVENTS["BEFORE_HIGHLIGHT"] = "element-range-highlight:beforehighlight";
    EVENTS["AFTER_HIGHLIGHT"] = "element-range-highlight:afterhighlight";
    EVENTS["BEFORE_CLEAR"] = "element-range-highlight:beforeclear";
    EVENTS["AFTER_CLEAR"] = "element-range-highlight:afterclear";
})(EVENTS || (EVENTS = {}));
export { EVENTS as ELEMENT_RANGE_HIGHLIGHT_EVENTS };
/**
 * @ignore
 * 区域 highlight 的 Action
 */
var ElementRangeHighlight = /** @class */ (function (_super) {
    __extends(ElementRangeHighlight, _super);
    function ElementRangeHighlight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stateName = 'active';
        return _this;
    }
    // 清理掉所有的 active， unactive 状态
    ElementRangeHighlight.prototype.clearViewState = function (view) {
        clearHighlight(view);
    };
    /**
     * 设置 highlight
     */
    ElementRangeHighlight.prototype.highlight = function () {
        var _a = this.context, view = _a.view, event = _a.event;
        var elements = this.getIntersectElements();
        var payload = { view: view, event: event, highlightElements: elements };
        view.emit(EVENTS.BEFORE_HIGHLIGHT, Event.fromData(view, EVENTS.BEFORE_HIGHLIGHT, payload));
        this.setState();
        view.emit(EVENTS.AFTER_HIGHLIGHT, Event.fromData(view, EVENTS.AFTER_HIGHLIGHT, payload));
    };
    /**
     * @overrider 添加事件
     */
    ElementRangeHighlight.prototype.clear = function () {
        var view = this.context.view;
        view.emit(EVENTS.BEFORE_CLEAR, Event.fromData(view, EVENTS.BEFORE_CLEAR, {}));
        _super.prototype.clear.call(this);
        view.emit(EVENTS.AFTER_CLEAR, Event.fromData(view, EVENTS.AFTER_CLEAR, {}));
    };
    ElementRangeHighlight.prototype.setElementsState = function (elements, enable, allElements) {
        setHighlightBy(allElements, function (el) { return elements.indexOf(el) >= 0; }, enable);
    };
    return ElementRangeHighlight;
}(ElementRangeState));
export default ElementRangeHighlight;
//# sourceMappingURL=range-highlight.js.map