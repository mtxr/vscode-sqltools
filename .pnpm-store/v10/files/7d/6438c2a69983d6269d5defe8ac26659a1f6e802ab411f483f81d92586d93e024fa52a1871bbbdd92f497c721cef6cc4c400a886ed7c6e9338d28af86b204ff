"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var __1 = require("..");
function isWheelDown(event) {
    var wheelEvent = event.gEvent.originalEvent;
    return wheelEvent.deltaY > 0;
}
var DEFAULT_WHEELDELTA = 1;
var MousewheelScroll = /** @class */ (function (_super) {
    tslib_1.__extends(MousewheelScroll, _super);
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
        var dataSize = (0, util_1.size)((0, util_1.valuesOfKey)(data, xScale.field));
        var step = (0, util_1.size)(xScale.values);
        var currentRatio = scrollbarController.getValue();
        var currentStart = Math.floor((dataSize - step) * currentRatio);
        var nextStart = currentStart + (isWheelDown(event) ? wheelDelta : -wheelDelta);
        var correction = wheelDelta / (dataSize - step) / 10000;
        var nextRatio = (0, util_1.clamp)(nextStart / (dataSize - step) + correction, 0, 1);
        scrollbarController.setValue(nextRatio);
    };
    return MousewheelScroll;
}(__1.Action));
exports.default = MousewheelScroll;
//# sourceMappingURL=mousewheel-scroll.js.map