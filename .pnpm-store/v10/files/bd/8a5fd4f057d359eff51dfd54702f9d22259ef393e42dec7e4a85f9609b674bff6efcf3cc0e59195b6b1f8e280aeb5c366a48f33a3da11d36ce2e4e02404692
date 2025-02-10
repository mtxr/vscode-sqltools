import { __extends } from "tslib";
import { clamp, size, valuesOfKey } from '@antv/util';
import { Action } from '..';
function isWheelDown(event) {
    var wheelEvent = event.gEvent.originalEvent;
    return wheelEvent.deltaY > 0;
}
var DEFAULT_WHEELDELTA = 1;
var MousewheelScroll = /** @class */ (function (_super) {
    __extends(MousewheelScroll, _super);
    function MousewheelScroll() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MousewheelScroll.prototype.scroll = function (arg) {
        var _a = this.context, view = _a.view, event = _a.event;
        if (!view.getOptions().scrollbar) {
            return;
        }
        var wheelDelta = (arg === null || arg === void 0 ? void 0 : arg.wheelDelta) || DEFAULT_WHEELDELTA;
        var scrollbarController = view.getController('scrollbar');
        var xScale = view.getXScale();
        var data = view.getOptions().data;
        var dataSize = size(valuesOfKey(data, xScale.field));
        var step = size(xScale.values);
        var currentRatio = scrollbarController.getValue();
        var currentStart = Math.floor((dataSize - step) * currentRatio);
        var nextStart = currentStart + (isWheelDown(event) ? wheelDelta : -wheelDelta);
        var correction = wheelDelta / (dataSize - step) / 10000;
        var nextRatio = clamp(nextStart / (dataSize - step) + correction, 0, 1);
        scrollbarController.setValue(nextRatio);
    };
    return MousewheelScroll;
}(Action));
export default MousewheelScroll;
//# sourceMappingURL=mousewheel-scroll.js.map