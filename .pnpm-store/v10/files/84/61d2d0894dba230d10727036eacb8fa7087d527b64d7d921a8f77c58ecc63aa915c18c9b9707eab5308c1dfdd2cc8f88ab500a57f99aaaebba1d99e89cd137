import { __extends } from "tslib";
import { each } from '@antv/util';
import { getSiblingPoint, getSilbings } from '../../util';
import TooltipAction from './geometry';
/**
 * 存在多个 view 时，控制其他 view 上的 tooltip 显示
 * @ignore
 */
var SiblingTooltip = /** @class */ (function (_super) {
    __extends(SiblingTooltip, _super);
    function SiblingTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 所有同一层级的 tooltip 显示
     * @param view
     * @param point
     */
    SiblingTooltip.prototype.showTooltip = function (view, point) {
        var siblings = getSilbings(view);
        each(siblings, function (sibling) {
            var siblingPoint = getSiblingPoint(view, sibling, point);
            sibling.showTooltip(siblingPoint);
        });
    };
    /**
     * 隐藏同一层级的 tooltip
     * @param view
     */
    SiblingTooltip.prototype.hideTooltip = function (view) {
        var siblings = getSilbings(view);
        each(siblings, function (sibling) {
            sibling.hideTooltip();
        });
    };
    return SiblingTooltip;
}(TooltipAction));
export default SiblingTooltip;
//# sourceMappingURL=sibling.js.map