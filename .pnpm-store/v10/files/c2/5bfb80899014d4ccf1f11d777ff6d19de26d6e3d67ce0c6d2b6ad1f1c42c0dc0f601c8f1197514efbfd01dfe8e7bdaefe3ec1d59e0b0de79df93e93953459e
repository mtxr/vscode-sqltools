import { __extends } from "tslib";
import Action from '../base';
import { distance } from '../util';
var DISTANCE = 4; // 移动的最小距离
/**
 * @ignore
 * View 支持 Drag 的 Action
 */
var Drag = /** @class */ (function (_super) {
    __extends(Drag, _super);
    function Drag() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Action 开始，不等同于 拖拽开始，需要判定移动的范围
        _this.starting = false;
        // 拖拽开始
        _this.dragStart = false;
        return _this;
    }
    /**
     * 开始
     */
    Drag.prototype.start = function () {
        this.starting = true;
        this.startPoint = this.context.getCurrentPoint();
    };
    /**
     * 拖拽
     */
    Drag.prototype.drag = function () {
        if (!this.startPoint) {
            return;
        }
        var current = this.context.getCurrentPoint();
        var view = this.context.view;
        var event = this.context.event;
        if (!this.dragStart) {
            if (distance(current, this.startPoint) > DISTANCE) {
                view.emit('dragstart', {
                    target: event.target,
                    x: event.x,
                    y: event.y,
                });
                this.dragStart = true;
            }
        }
        else {
            view.emit('drag', {
                target: event.target,
                x: event.x,
                y: event.y,
            });
        }
    };
    /**
     * 结束
     */
    Drag.prototype.end = function () {
        if (this.dragStart) {
            var view = this.context.view;
            var event_1 = this.context.event;
            view.emit('dragend', {
                target: event_1.target,
                x: event_1.x,
                y: event_1.y,
            });
        }
        this.starting = false;
        this.dragStart = false;
    };
    return Drag;
}(Action));
export default Drag;
//# sourceMappingURL=drag.js.map