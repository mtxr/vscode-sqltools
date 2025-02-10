import { __extends } from "tslib";
import { getActionClass } from '@antv/g2';
import { placeElementsOrdered } from '../util';
var ElementHighlightAction = getActionClass('element-highlight');
var VennElementHighlight = /** @class */ (function (_super) {
    __extends(VennElementHighlight, _super);
    function VennElementHighlight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 同步所有元素的位置
     */
    VennElementHighlight.prototype.syncElementsPos = function () {
        placeElementsOrdered(this.context.view);
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
export { VennElementHighlight };
//# sourceMappingURL=highlight.js.map