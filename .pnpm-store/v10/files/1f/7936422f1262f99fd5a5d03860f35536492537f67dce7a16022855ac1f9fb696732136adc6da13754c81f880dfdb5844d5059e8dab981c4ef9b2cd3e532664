"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VennElementHighlight = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("../util");
var ElementHighlightAction = (0, g2_1.getActionClass)('element-highlight');
var VennElementHighlight = /** @class */ (function (_super) {
    tslib_1.__extends(VennElementHighlight, _super);
    function VennElementHighlight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 同步所有元素的位置
     */
    VennElementHighlight.prototype.syncElementsPos = function () {
        (0, util_1.placeElementsOrdered)(this.context.view);
    };
    /** 高亮图形元素 */
    VennElementHighlight.prototype.highlight = function () {
        _super.prototype.highlight.call(this);
        this.syncElementsPos();
    };
    /** toggle 图形元素高亮状态 */
    VennElementHighlight.prototype.toggle = function () {
        _super.prototype.toggle.call(this);
        this.syncElementsPos();
    };
    /** 清楚 */
    VennElementHighlight.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.syncElementsPos();
    };
    /** 重置 */
    VennElementHighlight.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.syncElementsPos();
    };
    return VennElementHighlight;
}(ElementHighlightAction));
exports.VennElementHighlight = VennElementHighlight;
//# sourceMappingURL=highlight.js.map