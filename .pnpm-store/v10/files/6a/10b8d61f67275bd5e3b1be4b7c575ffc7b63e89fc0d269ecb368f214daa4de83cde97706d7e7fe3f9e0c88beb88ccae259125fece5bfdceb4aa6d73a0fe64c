import { __extends } from "tslib";
import { getElements, getElementValue } from '../util';
import Highlight from './highlight';
/**
 * Highlight color
 * @ignore
 */
var HighlightColor = /** @class */ (function (_super) {
    __extends(HighlightColor, _super);
    function HighlightColor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HighlightColor.prototype.setStateByElement = function (element, enable) {
        var view = this.context.view;
        var colorAttr = element.geometry.getAttribute('color');
        if (!colorAttr) {
            return;
        }
        var scale = view.getScaleByField(colorAttr.getFields()[0]);
        var value = getElementValue(element, scale.field);
        var elements = getElements(view);
        var highlightElements = elements.filter(function (el) {
            return getElementValue(el, scale.field) === value;
        });
        this.setHighlightBy(elements, function (el) { return highlightElements.includes(el); }, enable);
    };
    return HighlightColor;
}(Highlight));
export default HighlightColor;
//# sourceMappingURL=highlight-by-color.js.map