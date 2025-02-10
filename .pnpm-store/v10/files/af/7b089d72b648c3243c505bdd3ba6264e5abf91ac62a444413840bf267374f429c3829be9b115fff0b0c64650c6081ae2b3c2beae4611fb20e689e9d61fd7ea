import { __assign, __extends } from "tslib";
/**
 * @fileoverview line
 * @author dengfuping_develop@163.com
 */
import { Line as LineUtil } from '@antv/g-math';
import { each, isObject } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'line';
        _this.canFill = false;
        _this.canStroke = true;
        return _this;
    }
    Line.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return __assign(__assign({}, attrs), { x1: 0, y1: 0, x2: 0, y2: 0, startArrow: false, endArrow: false });
    };
    Line.prototype.createPath = function (context, targetAttrs) {
        var attrs = this.attr();
        var el = this.get('el');
        each(targetAttrs || attrs, function (value, attr) {
            if (attr === 'startArrow' || attr === 'endArrow') {
                if (value) {
                    var id = isObject(value)
                        ? context.addArrow(attrs, SVG_ATTR_MAP[attr])
                        : context.getDefaultArrow(attrs, SVG_ATTR_MAP[attr]);
                    el.setAttribute(SVG_ATTR_MAP[attr], "url(#" + id + ")");
                }
                else {
                    el.removeAttribute(SVG_ATTR_MAP[attr]);
                }
            }
            else if (SVG_ATTR_MAP[attr]) {
                el.setAttribute(SVG_ATTR_MAP[attr], value);
            }
        });
    };
    /**
     * Use math calculation to get length of line
     * @return {number} length
     */
    Line.prototype.getTotalLength = function () {
        var _a = this.attr(), x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2;
        return LineUtil.length(x1, y1, x2, y2);
    };
    /**
     * Use math calculation to get point according to ratio as same sa Canvas version
     * @param {number} ratio
     * @return {Point} point
     */
    Line.prototype.getPoint = function (ratio) {
        var _a = this.attr(), x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2;
        return LineUtil.pointAt(x1, y1, x2, y2, ratio);
    };
    return Line;
}(ShapeBase));
export default Line;
//# sourceMappingURL=line.js.map