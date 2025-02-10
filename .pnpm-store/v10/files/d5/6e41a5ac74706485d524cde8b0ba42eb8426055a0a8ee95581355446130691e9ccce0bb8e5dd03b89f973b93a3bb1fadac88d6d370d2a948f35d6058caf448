"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VennElementActive = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("../util");
var ElementActiveAction = (0, g2_1.getActionClass)('element-active');
var VennElementActive = /** @class */ (function (_super) {
    tslib_1.__extends(VennElementActive, _super);
    function VennElementActive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 同步所有元素的位置
     */
    VennElementActive.prototype.syncElementsPos = function () {
        (0, util_1.placeElementsOrdered)(this.context.view);
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
exports.VennElementActive = VennElementActive;
//# sourceMappingURL=active.js.map