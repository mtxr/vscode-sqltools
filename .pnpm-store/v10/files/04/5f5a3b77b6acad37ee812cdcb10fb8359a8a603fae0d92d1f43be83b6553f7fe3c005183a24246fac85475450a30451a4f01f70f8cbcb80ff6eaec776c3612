"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../util/util");
var base_1 = require("./base");
var LineCrosshair = /** @class */ (function (_super) {
    tslib_1.__extends(LineCrosshair, _super);
    function LineCrosshair() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineCrosshair.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { type: 'line', locationType: 'region', start: null, end: null });
    };
    // 直线的文本需要同直线垂直
    LineCrosshair.prototype.getRotateAngle = function () {
        var _a = this.getLocation(), start = _a.start, end = _a.end;
        var position = this.get('text').position;
        var angle = Math.atan2(end.y - start.y, end.x - start.x);
        var tangentAngle = position === 'start' ? angle - Math.PI / 2 : angle + Math.PI / 2;
        return tangentAngle;
    };
    LineCrosshair.prototype.getTextPoint = function () {
        var _a = this.getLocation(), start = _a.start, end = _a.end;
        var _b = this.get('text'), position = _b.position, offset = _b.offset;
        return util_1.getTextPoint(start, end, position, offset);
    };
    LineCrosshair.prototype.getLinePath = function () {
        var _a = this.getLocation(), start = _a.start, end = _a.end;
        return [
            ['M', start.x, start.y],
            ['L', end.x, end.y],
        ];
    };
    return LineCrosshair;
}(base_1.default));
exports.default = LineCrosshair;
//# sourceMappingURL=line.js.map