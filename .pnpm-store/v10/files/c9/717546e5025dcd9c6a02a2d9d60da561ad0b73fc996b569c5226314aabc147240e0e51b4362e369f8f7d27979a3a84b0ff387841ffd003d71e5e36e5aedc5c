import { __extends } from "tslib";
import { getElements, getElementValue, getCurrentElement } from '../util';
import Highlight, { STATUS_ACTIVE, STATUS_UNACTIVE } from './highlight';
/**
 * Highlight x
 * @ignore
 */
var HighlightX = /** @class */ (function (_super) {
    __extends(HighlightX, _super);
    function HighlightX() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 不允许多选
    HighlightX.prototype.setElementHighlight = function (el, callback) {
        if (callback(el)) {
            if (el.hasState(STATUS_UNACTIVE)) {
                el.setState(STATUS_UNACTIVE, false);
            }
            el.setState(STATUS_ACTIVE, true);
        }
        else {
            el.setState(STATUS_UNACTIVE, true);
            if (el.hasState(STATUS_ACTIVE)) {
                el.setState(STATUS_ACTIVE, false);
            }
        }
    };
    HighlightX.prototype.setStateByElement = function (element, enable) {
        var view = this.context.view;
        var scale = view.getXScale();
        var value = getElementValue(element, scale.field);
        var elements = getElements(view);
        var highlightElements = elements.filter(function (el) {
            return getElementValue(el, scale.field) === value;
        });
        this.setHighlightBy(elements, function (el) { return highlightElements.includes(el); }, enable);
    };
    /**
     * 切换状态
     */
    HighlightX.prototype.toggle = function () {
        var element = getCurrentElement(this.context);
        if (element) {
            var hasState = element.hasState(this.stateName);
            this.setStateByElement(element, !hasState);
        }
    };
    return HighlightX;
}(Highlight));
export default HighlightX;
//# sourceMappingURL=highlight-by-x.js.map