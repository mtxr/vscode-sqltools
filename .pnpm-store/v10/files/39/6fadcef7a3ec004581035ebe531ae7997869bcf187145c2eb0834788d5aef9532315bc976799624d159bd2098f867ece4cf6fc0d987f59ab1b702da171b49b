"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @fileoverview 线
 * @author dxq613@gmail.com
 */
var g_math_1 = require("@antv/g-math");
var base_1 = require("./base");
var line_1 = require("../util/in-stroke/line");
var ArrowUtil = require("../util/arrow");
var Line = /** @class */ (function (_super) {
    tslib_1.__extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { x1: 0, y1: 0, x2: 0, y2: 0, startArrow: false, endArrow: false });
    };
    Line.prototype.initAttrs = function (attrs) {
        this.setArrow();
    };
    // 更新属性时，检测是否更改了箭头
    Line.prototype.onAttrChange = function (name, value, originValue) {
        _super.prototype.onAttrChange.call(this, name, value, originValue);
        // 由于箭头的绘制依赖于 line 的诸多 attrs，因此这里不再对每个 attr 进行判断，attr 每次变化都会影响箭头的更新
        this.setArrow();
    };
    Line.prototype.setArrow = function () {
        var attrs = this.attr();
        var x1 = attrs.x1, y1 = attrs.y1, x2 = attrs.x2, y2 = attrs.y2, startArrow = attrs.startArrow, endArrow = attrs.endArrow;
        if (startArrow) {
            ArrowUtil.addStartArrow(this, attrs, x2, y2, x1, y1);
        }
        if (endArrow) {
            ArrowUtil.addEndArrow(this, attrs, x1, y1, x2, y2);
        }
    };
    Line.prototype.isInStrokeOrPath = function (x, y, isStroke, isFill, lineWidth) {
        if (!isStroke || !lineWidth) {
            return false;
        }
        var _a = this.attr(), x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2;
        return line_1.default(x1, y1, x2, y2, lineWidth, x, y);
    };
    Line.prototype.createPath = function (context) {
        var attrs = this.attr();
        var x1 = attrs.x1, y1 = attrs.y1, x2 = attrs.x2, y2 = attrs.y2, startArrow = attrs.startArrow, endArrow = attrs.endArrow;
        var startArrowDistance = {
            dx: 0,
            dy: 0,
        };
        var endArrowDistance = {
            dx: 0,
            dy: 0,
        };
        if (startArrow && startArrow.d) {
            startArrowDistance = ArrowUtil.getShortenOffset(x1, y1, x2, y2, attrs.startArrow.d);
        }
        if (endArrow && endArrow.d) {
            endArrowDistance = ArrowUtil.getShortenOffset(x1, y1, x2, y2, attrs.endArrow.d);
        }
        context.beginPath();
        // 如果自定义箭头，线条相应缩进
        context.moveTo(x1 + startArrowDistance.dx, y1 + startArrowDistance.dy);
        context.lineTo(x2 - endArrowDistance.dx, y2 - endArrowDistance.dy);
    };
    Line.prototype.afterDrawPath = function (context) {
        var startArrowShape = this.get('startArrowShape');
        var endArrowShape = this.get('endArrowShape');
        if (startArrowShape) {
            startArrowShape.draw(context);
        }
        if (endArrowShape) {
            endArrowShape.draw(context);
        }
    };
    /**
     * Get length of line
     * @return {number} length
     */
    Line.prototype.getTotalLength = function () {
        var _a = this.attr(), x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2;
        return g_math_1.Line.length(x1, y1, x2, y2);
    };
    /**
     * Get point according to ratio
     * @param {number} ratio
     * @return {Point} point
     */
    Line.prototype.getPoint = function (ratio) {
        var _a = this.attr(), x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2;
        return g_math_1.Line.pointAt(x1, y1, x2, y2, ratio);
    };
    return Line;
}(base_1.default));
exports.default = Line;
//# sourceMappingURL=line.js.map