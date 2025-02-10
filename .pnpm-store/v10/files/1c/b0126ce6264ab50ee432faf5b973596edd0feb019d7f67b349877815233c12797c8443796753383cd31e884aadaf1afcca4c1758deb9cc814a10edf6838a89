"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g_math_1 = require("@antv/g-math");
var g_math_2 = require("@antv/g-math");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var base_1 = require("./base");
var Polyline = /** @class */ (function (_super) {
    tslib_1.__extends(Polyline, _super);
    function Polyline() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'polyline';
        _this.canFill = true;
        _this.canStroke = true;
        return _this;
    }
    Polyline.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { startArrow: false, endArrow: false });
    };
    // 更新属性时，检测是否更改了 points
    Polyline.prototype.onAttrChange = function (name, value, originValue) {
        _super.prototype.onAttrChange.call(this, name, value, originValue);
        if (['points'].indexOf(name) !== -1) {
            this._resetCache();
        }
    };
    Polyline.prototype._resetCache = function () {
        this.set('totalLength', null);
        this.set('tCache', null);
    };
    Polyline.prototype.createPath = function (context, targetAttrs) {
        var attrs = this.attr();
        var el = this.get('el');
        util_1.each(targetAttrs || attrs, function (value, attr) {
            if (attr === 'points' && util_1.isArray(value) && value.length >= 2) {
                el.setAttribute('points', value.map(function (point) { return point[0] + "," + point[1]; }).join(' '));
            }
            else if (constant_1.SVG_ATTR_MAP[attr]) {
                el.setAttribute(constant_1.SVG_ATTR_MAP[attr], value);
            }
        });
    };
    /**
     * Get length of polyline
     * @return {number} length
     */
    Polyline.prototype.getTotalLength = function () {
        var points = this.attr().points;
        // get totalLength from cache
        var totalLength = this.get('totalLength');
        if (!util_1.isNil(totalLength)) {
            return totalLength;
        }
        this.set('totalLength', g_math_1.Polyline.length(points));
        return this.get('totalLength');
    };
    /**
     * Get point according to ratio
     * @param {number} ratio
     * @return {Point} point
     */
    Polyline.prototype.getPoint = function (ratio) {
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
        return g_math_2.Line.pointAt(points[index][0], points[index][1], points[index + 1][0], points[index + 1][1], subt);
    };
    Polyline.prototype._setTcache = function () {
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
                segmentL = g_math_2.Line.length(p[0], p[1], points[i + 1][0], points[i + 1][1]);
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
    Polyline.prototype.getStartTangent = function () {
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
    Polyline.prototype.getEndTangent = function () {
        var points = this.attr().points;
        var l = points.length - 1;
        var result = [];
        result.push([points[l - 1][0], points[l - 1][1]]);
        result.push([points[l][0], points[l][1]]);
        return result;
    };
    return Polyline;
}(base_1.default));
exports.default = Polyline;
//# sourceMappingURL=polyline.js.map