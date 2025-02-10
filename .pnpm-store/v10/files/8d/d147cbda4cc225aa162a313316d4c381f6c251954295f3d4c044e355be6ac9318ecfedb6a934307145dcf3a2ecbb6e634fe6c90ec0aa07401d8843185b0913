"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var coordinate_1 = require("../../util/coordinate");
var coordinate_2 = require("../../util/coordinate");
var base_1 = tslib_1.__importDefault(require("./base"));
var HALF_PI = Math.PI / 2;
/**
 * 极坐标下的图形 label
 */
var PolarLabel = /** @class */ (function (_super) {
    tslib_1.__extends(PolarLabel, _super);
    function PolarLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @override
     * @desc 获取 label offset
     * polar & theta coordinate support「string」type, should transform to 「number」
     */
    PolarLabel.prototype.getLabelOffset = function (offset) {
        var coordinate = this.getCoordinate();
        var actualOffset = 0;
        if ((0, util_1.isNumber)(offset)) {
            actualOffset = offset;
        }
        else if ((0, util_1.isString)(offset) && offset.indexOf('%') !== -1) {
            var r = coordinate.getRadius();
            if (coordinate.innerRadius > 0) {
                r = r * (1 - coordinate.innerRadius);
            }
            actualOffset = parseFloat(offset) * 0.01 * r;
        }
        return actualOffset;
    };
    /**
     * @override
     * 获取 labelItems, 增加切片 percent
     * @param mapppingArray
     */
    PolarLabel.prototype.getLabelItems = function (mapppingArray) {
        var items = _super.prototype.getLabelItems.call(this, mapppingArray);
        var yScale = this.geometry.getYScale();
        return (0, util_1.map)(items, function (item) {
            if (item && yScale) {
                var percent = yScale.scale((0, util_1.get)(item.data, yScale.field));
                return tslib_1.__assign(tslib_1.__assign({}, item), { percent: percent });
            }
            return item;
        });
    };
    /**
     * @override
     * 获取文本的对齐方式
     * @param point
     */
    PolarLabel.prototype.getLabelAlign = function (point) {
        var coordinate = this.getCoordinate();
        var align;
        if (point.labelEmit) {
            align = point.angle <= Math.PI / 2 && point.angle >= -Math.PI / 2 ? 'left' : 'right';
        }
        else if (!coordinate.isTransposed) {
            align = 'center';
        }
        else {
            var center = coordinate.getCenter();
            var offset = point.offset;
            if (Math.abs(point.x - center.x) < 1) {
                align = 'center';
            }
            else if (point.angle > Math.PI || point.angle <= 0) {
                align = offset > 0 ? 'left' : 'right';
            }
            else {
                align = offset > 0 ? 'right' : 'left';
            }
        }
        return align;
    };
    /**
     * @override
     * 获取 label 的位置
     * @param labelCfg
     * @param mappingData
     * @param index
     */
    PolarLabel.prototype.getLabelPoint = function (labelCfg, mappingData, index) {
        var factor = 1;
        var arcPoint;
        var content = labelCfg.content[index];
        if (this.isToMiddle(mappingData)) {
            arcPoint = this.getMiddlePoint(mappingData.points);
        }
        else {
            if (labelCfg.content.length === 1 && index === 0) {
                index = 1;
            }
            else if (index === 0) {
                factor = -1;
            }
            arcPoint = this.getArcPoint(mappingData, index);
        }
        var offset = labelCfg.offset * factor;
        var middleAngle = this.getPointAngle(arcPoint);
        var isLabelEmit = labelCfg.labelEmit;
        var labelPositionCfg = this.getCirclePoint(middleAngle, offset, arcPoint, isLabelEmit);
        if (labelPositionCfg.r === 0) {
            // 如果文本位置位于圆心，则不展示
            labelPositionCfg.content = '';
        }
        else {
            labelPositionCfg.content = content;
            labelPositionCfg.angle = middleAngle;
            labelPositionCfg.color = mappingData.color;
        }
        labelPositionCfg.rotate = labelCfg.autoRotate
            ? this.getLabelRotate(middleAngle, offset, isLabelEmit)
            : labelCfg.rotate;
        labelPositionCfg.start = {
            x: arcPoint.x,
            y: arcPoint.y,
        };
        return labelPositionCfg;
    };
    /**
     * 获取圆弧的位置
     */
    PolarLabel.prototype.getArcPoint = function (mappingData, index) {
        if (index === void 0) { index = 0; }
        if (!(0, util_1.isArray)(mappingData.x) && !(0, util_1.isArray)(mappingData.y)) {
            return {
                x: mappingData.x,
                y: mappingData.y,
            };
        }
        return {
            x: (0, util_1.isArray)(mappingData.x) ? mappingData.x[index] : mappingData.x,
            y: (0, util_1.isArray)(mappingData.y) ? mappingData.y[index] : mappingData.y,
        };
    };
    /**
     * 计算坐标线点在极坐标系下角度
     * @param point
     */
    PolarLabel.prototype.getPointAngle = function (point) {
        return (0, coordinate_2.getAngleByPoint)(this.getCoordinate(), point);
    };
    /**
     * 获取坐标点与圆心形成的圆的位置信息
     * @param angle
     * @param offset
     * @param point
     * @param isLabelEmit
     */
    PolarLabel.prototype.getCirclePoint = function (angle, offset, point, isLabelEmit) {
        var coordinate = this.getCoordinate();
        var center = coordinate.getCenter();
        var r = (0, coordinate_1.getDistanceToCenter)(coordinate, point);
        if (r === 0) {
            return tslib_1.__assign(tslib_1.__assign({}, center), { r: r });
        }
        var labelAngle = angle;
        if (coordinate.isTransposed && r > offset && !isLabelEmit) {
            var appendAngle = Math.asin(offset / (2 * r));
            labelAngle = angle + appendAngle * 2;
        }
        else {
            r = r + offset;
        }
        return {
            x: center.x + r * Math.cos(labelAngle),
            y: center.y + r * Math.sin(labelAngle),
            r: r,
        };
    };
    /**
     * 获取 label 的旋转角度
     * @param angle
     * @param offset
     * @param isLabelEmit
     */
    PolarLabel.prototype.getLabelRotate = function (angle, offset, isLabelEmit) {
        var rotate = angle + HALF_PI;
        if (isLabelEmit) {
            rotate -= HALF_PI;
        }
        if (rotate) {
            if (rotate > HALF_PI) {
                rotate = rotate - Math.PI;
            }
            else if (rotate < -HALF_PI) {
                rotate = rotate + Math.PI;
            }
        }
        return rotate;
    };
    // 获取中心的位置
    PolarLabel.prototype.getMiddlePoint = function (points) {
        var coordinate = this.getCoordinate();
        var count = points.length;
        var middlePoint = {
            x: 0,
            y: 0,
        };
        (0, util_1.each)(points, function (point) {
            middlePoint.x += point.x;
            middlePoint.y += point.y;
        });
        middlePoint.x /= count;
        middlePoint.y /= count;
        middlePoint = coordinate.convert(middlePoint);
        return middlePoint;
    };
    // 是否居中
    PolarLabel.prototype.isToMiddle = function (mappingData) {
        return mappingData.x.length > 2;
    };
    return PolarLabel;
}(base_1.default));
exports.default = PolarLabel;
//# sourceMappingURL=polar.js.map