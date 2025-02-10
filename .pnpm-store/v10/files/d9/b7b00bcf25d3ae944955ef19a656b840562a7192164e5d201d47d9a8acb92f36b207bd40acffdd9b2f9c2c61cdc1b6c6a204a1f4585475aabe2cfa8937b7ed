"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var util_2 = require("../../util");
var geometry_1 = tslib_1.__importDefault(require("./geometry"));
/**
 * 存在多个 view 时，控制其他 view 上的 tooltip 显示
 * @ignore
 */
var SiblingTooltip = /** @class */ (function (_super) {
    tslib_1.__extends(SiblingTooltip, _super);
    function SiblingTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 所有同一层级的 tooltip 显示
     * @param view
     * @param point
     */
    SiblingTooltip.prototype.showTooltip = function (view, point) {
        var siblings = (0, util_2.getSilbings)(view);
        (0, util_1.each)(siblings, function (sibling) {
            var siblingPoint = (0, util_2.getSiblingPoint)(view, sibling, point);
            sibling.showTooltip(siblingPoint);
        });
    };
    /**
     * 隐藏同一层级的 tooltip
     * @param view
     */
    SiblingTooltip.prototype.hideTooltip = function (view) {
        var siblings = (0, util_2.getSilbings)(view);
        (0, util_1.each)(siblings, function (sibling) {
            sibling.hideTooltip();
        });
    };
    return SiblingTooltip;
}(geometry_1.default));
exports.default = SiblingTooltip;
//# sourceMappingURL=sibling.js.map