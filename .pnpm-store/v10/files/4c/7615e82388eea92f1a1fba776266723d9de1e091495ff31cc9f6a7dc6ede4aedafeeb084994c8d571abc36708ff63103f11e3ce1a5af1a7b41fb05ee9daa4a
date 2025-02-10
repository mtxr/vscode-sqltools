"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../util");
var highlight_1 = tslib_1.__importStar(require("./highlight"));
/**
 * Highlight x
 * @ignore
 */
var HighlightX = /** @class */ (function (_super) {
    tslib_1.__extends(HighlightX, _super);
    function HighlightX() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 不允许多选
    HighlightX.prototype.setElementHighlight = function (el, callback) {
        if (callback(el)) {
            if (el.hasState(highlight_1.STATUS_UNACTIVE)) {
                el.setState(highlight_1.STATUS_UNACTIVE, false);
            }
            el.setState(highlight_1.STATUS_ACTIVE, true);
        }
        else {
            el.setState(highlight_1.STATUS_UNACTIVE, true);
            if (el.hasState(highlight_1.STATUS_ACTIVE)) {
                el.setState(highlight_1.STATUS_ACTIVE, false);
            }
        }
    };
    HighlightX.prototype.setStateByElement = function (element, enable) {
        var view = this.context.view;
        var scale = view.getXScale();
        var value = (0, util_1.getElementValue)(element, scale.field);
        var elements = (0, util_1.getElements)(view);
        var highlightElements = elements.filter(function (el) {
            return (0, util_1.getElementValue)(el, scale.field) === value;
        });
        this.setHighlightBy(elements, function (el) { return highlightElements.includes(el); }, enable);
    };
    /**
     * 切换状态
     */
    HighlightX.prototype.toggle = function () {
        var element = (0, util_1.getCurrentElement)(this.context);
        if (element) {
            var hasState = element.hasState(this.stateName);
            this.setStateByElement(element, !hasState);
        }
    };
    return HighlightX;
}(highlight_1.default));
exports.default = HighlightX;
//# sourceMappingURL=highlight-by-x.js.map