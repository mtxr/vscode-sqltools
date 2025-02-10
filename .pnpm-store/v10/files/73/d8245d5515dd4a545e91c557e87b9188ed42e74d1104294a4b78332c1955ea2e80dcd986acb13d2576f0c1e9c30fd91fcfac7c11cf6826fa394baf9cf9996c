import { __extends } from "tslib";
import { getActionClass } from '@antv/g2';
import { placeElementsOrdered } from '../util';
var ElementActiveAction = getActionClass('element-active');
var VennElementActive = /** @class */ (function (_super) {
    __extends(VennElementActive, _super);
    function VennElementActive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 同步所有元素的位置
     */
    VennElementActive.prototype.syncElementsPos = function () {
        placeElementsOrdered(this.context.view);
    };
    /** 激活图形元素 */
    VennElementActive.prototype.active = function () {
        _super.prototype.active.call(this);
        this.syncElementsPos();
    };
    /** toggle 图形元素激活状态 */
    VennElementActive.prototype.toggle = function () {
        _super.prototype.toggle.call(this);
        this.syncElementsPos();
    };
    /** 重置 */
    VennElementActive.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.syncElementsPos();
    };
    return VennElementActive;
}(ElementActiveAction));
export { VennElementActive };
//# sourceMappingURL=active.js.map