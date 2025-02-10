"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var coordinate_1 = require("../../util/coordinate");
var graphics_1 = require("../../util/graphics");
var polar_1 = tslib_1.__importDefault(require("./polar"));
/**
 * 饼图 label
 */
var PieLabel = /** @class */ (function (_super) {
    tslib_1.__extends(PieLabel, _super);
    function PieLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultLayout = 'distribute';
        return _this;
    }
    PieLabel.prototype.getDefaultLabelCfg = function (offset, position) {
        var cfg = _super.prototype.getDefaultLabelCfg.call(this, offset, position);
        return (0, util_1.deepMix)({}, cfg, (0, util_1.get)(this.geometry.theme, 'pieLabels', {}));
    };
    /** @override */
    PieLabel.prototype.getLabelOffset = function (offset) {
        return _super.prototype.getLabelOffset.call(this, offset) || 0;
    };
    PieLabel.prototype.getLabelRotate = function (angle, offset, isLabelLimit) {
        var rotate;
        if (offset < 0) {
            rotate = angle;
            if (rotate > Math.PI / 2) {
                rotate = rotate - Math.PI;
            }
            if (rotate < -Math.PI / 2) {
                rotate = rotate + Math.PI;
            }
        }
        return rotate;
    };
    PieLabel.prototype.getLabelAlign = function (point) {
        var coordinate = this.getCoordinate();
        var center = coordinate.getCenter();
        var align;
        if (point.angle <= Math.PI / 2 && point.x >= center.x) {
            align = 'left';
        }
        else {
            align = 'right';
        }
        if (point.offset <= 0) {
            if (align === 'right') {
                align = 'left';
            }
            else {
                align = 'right';
            }
        }
        return align;
    };
    PieLabel.prototype.getArcPoint = function (point) {
        return point;
    };
    PieLabel.prototype.getPointAngle = function (point) {
        var coordinate = this.getCoordinate();
        var startPoint = {
            x: (0, util_1.isArray)(point.x) ? point.x[0] : point.x,
            y: point.y[0],
        };
        var endPoint = {
            x: (0, util_1.isArray)(point.x) ? point.x[1] : point.x,
            y: point.y[1],
        };
        var angle;
        var startAngle = (0, coordinate_1.getAngleByPoint)(coordinate, startPoint);
        if (point.points && point.points[0].y === point.points[1].y) {
            angle = startAngle;
        }
        else {
            var endAngle = (0, coordinate_1.getAngleByPoint)(coordinate, endPoint);
            if (startAngle >= endAngle) {
                // 100% pie slice
                endAngle = endAngle + Math.PI * 2;
            }
            angle = startAngle + (endAngle - startAngle) / 2;
        }
        return angle;
    };
    /** @override */
    PieLabel.prototype.getCirclePoint = function (angle, offset) {
        var coordinate = this.getCoordinate();
        var center = coordinate.getCenter();
        var r = coordinate.getRadius() + offset;
        return tslib_1.__assign(tslib_1.__assign({}, (0, graphics_1.polarToCartesian)(center.x, center.y, r, angle)), { angle: angle, r: r });
    };
    return PieLabel;
}(polar_1.default));
exports.default = PieLabel;
//# sourceMappingURL=pie.js.map