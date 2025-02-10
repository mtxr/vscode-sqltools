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
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { type: 'circle', locationType: 'circle', center: null, radius: 100, startAngle: -Math.PI / 2, endAngle: (Math.PI * 3) / 2 });
    };
    LineCrosshair.prototype.getRotateAngle = function () {
        var _a = this.getLocation(), startAngle = _a.startAngle, endAngle = _a.endAngle;
        var position = this.get('text').position;
        var tangentAngle = position === 'start' ? startAngle + Math.PI / 2 : endAngle - Math.PI / 2;
        return tangentAngle;
    };
    LineCrosshair.prototype.getTextPoint = function () {
        var text = this.get('text');
        var position = text.position, offset = text.offset;
        var _a = this.getLocation(), center = _a.center, radius = _a.radius, startAngle = _a.startAngle, endAngle = _a.endAngle;
        var angle = position === 'start' ? startAngle : endAngle;
        var tangentAngle = this.getRotateAngle() - Math.PI;
        var point = util_1.getCirclePoint(center, radius, angle);
        // 这个地方其实应该求切线向量然后在乘以 offset，但是太啰嗦了，直接给出结果
        // const tangent = [Math.cos(tangentAngle), Math.sin(tangentAngle)];
        // const offsetVector = vec2.scale([], tangent, offset);
        var offsetX = Math.cos(tangentAngle) * offset;
        var offsetY = Math.sin(tangentAngle) * offset;
        return {
            x: point.x + offsetX,
            y: point.y + offsetY,
        };
    };
    LineCrosshair.prototype.getLinePath = function () {
        var _a = this.getLocation(), center = _a.center, radius = _a.radius, startAngle = _a.startAngle, endAngle = _a.endAngle;
        var path = null;
        if (endAngle - startAngle === Math.PI * 2) {
            // 整圆
            var x = center.x, y = center.y;
            path = [
                ['M', x, y - radius],
                ['A', radius, radius, 0, 1, 1, x, y + radius],
                ['A', radius, radius, 0, 1, 1, x, y - radius],
                ['Z'],
            ];
        }
        else {
            var startPoint = util_1.getCirclePoint(center, radius, startAngle);
            var endPoint = util_1.getCirclePoint(center, radius, endAngle);
            var large = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
            var sweep = startAngle > endAngle ? 0 : 1;
            path = [
                ['M', startPoint.x, startPoint.y],
                ['A', radius, radius, 0, large, sweep, endPoint.x, endPoint.y],
            ];
        }
        return path;
    };
    return LineCrosshair;
}(base_1.default));
exports.default = LineCrosshair;
//# sourceMappingURL=circle.js.map