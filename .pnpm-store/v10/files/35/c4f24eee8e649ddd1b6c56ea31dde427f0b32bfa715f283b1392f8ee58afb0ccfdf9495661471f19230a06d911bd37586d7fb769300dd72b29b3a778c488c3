"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../util");
var highlight_util_1 = require("./highlight-util");
var single_state_1 = tslib_1.__importDefault(require("./single-state"));
/**
 * @ignore
 * 单个 Element Highlight 的 Action
 */
var ElementSingleHighlight = /** @class */ (function (_super) {
    tslib_1.__extends(ElementSingleHighlight, _super);
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
        var elements = (0, util_1.getElements)(view);
        (0, highlight_util_1.setHighlightBy)(elements, function (el) { return element === el; }, enable);
    };
    // 清理掉所有的 active， unactive 状态
    ElementSingleHighlight.prototype.clear = function () {
        var view = this.context.view;
        (0, highlight_util_1.clearHighlight)(view);
    };
    return ElementSingleHighlight;
}(single_state_1.default));
exports.default = ElementSingleHighlight;
//# sourceMappingURL=single-highlight.js.map