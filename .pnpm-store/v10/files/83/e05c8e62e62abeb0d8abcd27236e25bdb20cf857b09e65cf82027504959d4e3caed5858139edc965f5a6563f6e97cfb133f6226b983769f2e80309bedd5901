"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g_math_1 = require("@antv/g-math");
var g_math_2 = require("@antv/g-math");
var util_1 = require("@antv/util");
var base_1 = require("./base");
var polyline_1 = require("../util/in-stroke/polyline");
var ArrowUtil = require("../util/arrow");
var PolyLine = /** @class */ (function (_super) {
    tslib_1.__extends(PolyLine, _super);
    function PolyLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PolyLine.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { startArrow: false, endArrow: false });
    };
    PolyLine.prototype.initAttrs = function (attrs) {
        this.setArrow();
    };
    // 更新属性时，检测是否更改了 points
    PolyLine.prototype.onAttrChange = function (name, value, originValue) {
        _super.prototype.onAttrChange.call(this, name, value, originValue);
        this.setArrow();
        if (['points'].indexOf(name) !== -1) {
            this._resetCache();
        }
    };
    PolyLine.prototype._resetCache = function () {
        this.set('totalLength', null);
        this.set('tCache', null);
    };
    PolyLine.prototype.setArrow = function () {
        var attrs = this.attr();
        var _a = this.attrs, points = _a.points, startArrow = _a.startArrow, endArrow = _a.endArrow;
        var length = points.length;
        var x1 = points[0][0];
        var y1 = points[0][1];
        var x2 = points[length - 1][0];
        var y2 = points[length - 1][1];
        if (startArrow) {
            ArrowUtil.addStartArrow(this, attrs, points[1][0], points[1][1], x1, y1);
        }
        if (endArrow) {
            ArrowUtil.addEndArrow(this, attrs, points[length - 2][0], points[length - 2][1], x2, y2);
        }
    };
    // 不允许 fill
    PolyLine.prototype.isFill = function () {
        return false;
    };
    PolyLine.prototype.isInStrokeOrPath = function (x, y, isStroke, isFill, lineWidth) {
        // 没有设置 stroke 不能被拾取, 没有线宽不能被拾取
        if (!isStroke || !lineWidth) {
            return false;
        }
        var points = this.attr().points;
        return polyline_1.default(points, lineWidth, x, y, false);
    };
    // 始终填充
    PolyLine.prototype.isStroke = function () {
        return true;
    };
    PolyLine.prototype.createPath = function (context) {
        var _a = this.attr(), points = _a.points, startArrow = _a.startArrow, endArrow = _a.endArrow;
        var length = points.length;
        if (points.length < 2) {
            return;
        }
        var x1 = points[0][0];
        var y1 = points[0][1];
        var x2 = points[length - 1][0];
        var y2 = points[length - 1][1];
        // 如果定义了箭头，并且是自定义箭头，线条相应缩进
        if (startArrow && startArrow.d) {
            var distance = ArrowUtil.getShortenOffset(x1, y1, points[1][0], points[1][1], startArrow.d);
            x1 += distance.dx;
            y1 += distance.dy;
        }
        if (endArrow && endArrow.d) {
            var distance = ArrowUtil.getShortenOffset(points[length - 2][0], points[length - 2][1], x2, y2, endArrow.d);
            x2 -= distance.dx;
            y2 -= distance.dy;
        }
        context.beginPath();
        context.moveTo(x1, y1);
        for (var i = 0; i < length - 1; i++) {
            var point = points[i];
            context.lineTo(point[0], point[1]);
        }
        context.lineTo(x2, y2);
    };
    PolyLine.prototype.afterDrawPath = function (context) {
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
     * Get length of polyline
     * @return {number} length
     */
    PolyLine.prototype.getTotalLength = function () {
        var points = this.attr().points;
        // get totalLength from cache
        var totalLength = this.get('totalLength');
        if (!util_1.isNil(totalLength)) {
            return totalLength;
        }
        this.set('totalLength', g_math_2.Polyline.length(points));
        return this.get('totalLength');
    };
    /**
     * Get point according to ratio
     * @param {number} ratio
     * @return {Point} point
     */
    PolyLine.prototype.getPoint = function (ratio) {
        var points = this.attr().points;
        // get tCache from cache
        var tCache = this.get('tCache');
        if (!tCache) {
            this._setTcache();
            tCache = this.get('tCache');
        }
        var subt;
        var index;
        util_1.each(tCache, function (v, i) {
            if (ratio >= v[0] && ratio <= v[1]) {
                subt = (ratio - v[0]) / (v[1] - v[0]);
                index = i;
            }
        });
        return g_math_1.Line.pointAt(points[index][0], points[index][1], points[index + 1][0], points[index + 1][1], subt);
    };
    PolyLine.prototype._setTcache = function () {
        var points = this.attr().points;
        if (!points || points.length === 0) {
            return;
        }
        var totalLength = this.getTotalLength();
        if (totalLength <= 0) {
            return;
        }
        var tempLength = 0;
        var tCache = [];
        var segmentT;
        var segmentL;
        util_1.each(points, function (p, i) {
            if (points[i + 1]) {
                segmentT = [];
                segmentT[0] = tempLength / totalLength;
                segmentL = g_math_1.Line.length(p[0], p[1], points[i + 1][0], points[i + 1][1]);
                tempLength += segmentL;
                segmentT[1] = tempLength / totalLength;
                tCache.push(segmentT);
            }
        });
        this.set('tCache', tCache);
    };
    /**
     * Get start tangent vector
     * @return {Array}
     */
    PolyLine.prototype.getStartTangent = function () {
        var points = this.attr().points;
        var result = [];
        result.push([points[1][0], points[1][1]]);
        result.push([points[0][0], points[0][1]]);
        return result;
    };
    /**
     * Get end tangent vector
     * @return {Array}
     */
    PolyLine.prototype.getEndTangent = function () {
        var points = this.attr().points;
        var l = points.length - 1;
        var result = [];
        result.push([points[l - 1][0], points[l - 1][1]]);
        result.push([points[l][0], points[l][1]]);
        return result;
    };
    return PolyLine;
}(base_1.default));
exports.default = PolyLine;
//# sourceMappingURL=polyline.js.map