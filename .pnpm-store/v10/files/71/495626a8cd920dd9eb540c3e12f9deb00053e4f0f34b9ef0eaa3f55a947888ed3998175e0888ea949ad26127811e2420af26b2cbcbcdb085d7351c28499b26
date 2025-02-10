import { __extends } from "tslib";
import { getElements } from '../util';
import { clearHighlight, setHighlightBy } from './highlight-util';
import ElementSingleState from './single-state';
/**
 * @ignore
 * 单个 Element Highlight 的 Action
 */
var ElementSingleHighlight = /** @class */ (function (_super) {
    __extends(ElementSingleHighlight, _super);
    function ElementSingleHighlight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stateName = 'active';
        return _this;
    }
    /**
     * Element Highlight
     */
    ElementSingleHighlight.prototype.highlight = function () {
        this.setState();
    };
    ElementSingleHighlight.prototype.setElementState = function (element, enable) {
        var view = this.context.view;
        var elements = getElements(view);
        setHighlightBy(elements, function (el) { return element === el; }, enable);
    };
    // 清理掉所有的 active， unactive 状态
    ElementSingleHighlight.prototype.clear = function () {
        var view = this.context.view;
        clearHighlight(view);
    };
    return ElementSingleHighlight;
}(ElementSingleState));
export default ElementSingleHighlight;
//# sourceMappingURL=single-highlight.js.map