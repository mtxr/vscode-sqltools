"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @fileoverview line
 * @author dengfuping_develop@163.com
 */
var g_math_1 = require("@antv/g-math");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var base_1 = require("./base");
var Line = /** @class */ (function (_super) {
    tslib_1.__extends(Line, _super);
    function Line() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'line';
        _this.canFill = false;
        _this.canStroke = true;
        return _this;
    }
    Line.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { x1: 0, y1: 0, x2: 0, y2: 0, startArrow: false, endArrow: false });
    };
    Line.prototype.createPath = function (context, targetAttrs) {
        var attrs = this.attr();
        var el = this.get('el');
        util_1.each(targetAttrs || attrs, function (value, attr) {
            if (attr === 'startArrow' || attr === 'endArrow') {
                if (value) {
                    var id = util_1.isObject(value)
                        ? context.addArrow(attrs, constant_1.SVG_ATTR_MAP[attr])
                        : context.getDefaultArrow(attrs, constant_1.SVG_ATTR_MAP[attr]);
                    el.setAttribute(constant_1.SVG_ATTR_MAP[attr], "url(#" + id + ")");
                }
                else {
                    el.removeAttribute(constant_1.SVG_ATTR_MAP[attr]);
                }
            }
            else if (constant_1.SVG_ATTR_MAP[attr]) {
                el.setAttribute(constant_1.SVG_ATTR_MAP[attr], value);
            }
        });
    };
    /**
     * Use math calculation to get length of line
     * @return {number} length
     */
    Line.prototype.getTotalLength = function () {
        var _a = this.attr(), x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2;
        return g_math_1.Line.length(x1, y1, x2, y2);
    };
    /**
     * Use math calculation to get point according to ratio as same sa Canvas version
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