"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../util");
var highlight_1 = tslib_1.__importDefault(require("./highlight"));
/**
 * Highlight color
 * @ignore
 */
var HighlightColor = /** @class */ (function (_super) {
    tslib_1.__extends(HighlightColor, _super);
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
        var value = (0, util_1.getElementValue)(element, scale.field);
        var elements = (0, util_1.getElements)(view);
        var highlightElements = elements.filter(function (el) {
            return (0, util_1.getElementValue)(el, scale.field) === value;
        });
        this.setHighlightBy(elements, function (el) { return highlightElements.includes(el); }, enable);
    };
    return HighlightColor;
}(highlight_1.default));
exports.default = HighlightColor;
//# sourceMappingURL=highlight-by-color.js.map