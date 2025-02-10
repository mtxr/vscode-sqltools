import { __extends } from "tslib";
import { isEqual, get } from '@antv/util';
import Action from '../../base';
/**
 * Tooltip 展示隐藏的 Action
 * @ignore
 */
var TooltipAction = /** @class */ (function (_super) {
    __extends(TooltipAction, _super);
    function TooltipAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timeStamp = 0;
        return _this;
    }
    /**
     * 显示 Tooltip
     * @returns
     */
    TooltipAction.prototype.show = function () {
        var context = this.context;
        var ev = context.event;
        var view = context.view;
        var isTooltipLocked = view.isTooltipLocked();
        if (isTooltipLocked) {
            // 锁定时不移动 tooltip
            return;
        }
        var lastTimeStamp = this.timeStamp;
        var timeStamp = +new Date();
        // 在 showDelay 毫秒（默认 16ms）内到 tooltip 上可以实现 enterable（调参工程师）
        var showDelay = get(context.view.getOptions(), 'tooltip.showDelay', 16);
        if (timeStamp - lastTimeStamp > showDelay) {
            var preLoc = this.location;
            var curLoc = { x: ev.x, y: ev.y };
            if (!preLoc || !isEqual(preLoc, curLoc)) {
                this.showTooltip(view, curLoc);
            }
            this.timeStamp = timeStamp;
            this.location = curLoc;
        }
    };
    /**
     * 隐藏 Tooltip。
     * @returns
     */
    TooltipAction.prototype.hide = function () {
        var view = this.context.view;
        var tooltip = view.getController('tooltip');
        var _a = this.context.event, clientX = _a.clientX, clientY = _a.clientY;
        // 如果已经 enterable + 已经在 tooltip 上，那么不隐藏
        if (tooltip.isCursorEntered({ x: clientX, y: clientY })) {
            return;
        }
        // 锁定 tooltip 时不隐藏
        if (view.isTooltipLocked()) {
            return;
        }
        this.hideTooltip(view);
        this.location = null;
    };
    TooltipAction.prototype.showTooltip = function (view, point) {
        // 相同位置不重复展示
        view.showTooltip(point);
    };
    TooltipAction.prototype.hideTooltip = function (view) {
        view.hideTooltip();
    };
    return TooltipAction;
}(Action));
export default TooltipAction;
//# sourceMappingURL=geometry.js.map