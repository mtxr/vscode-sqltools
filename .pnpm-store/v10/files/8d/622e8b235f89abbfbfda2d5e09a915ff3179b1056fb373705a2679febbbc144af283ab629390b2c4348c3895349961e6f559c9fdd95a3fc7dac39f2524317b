/**
 * @fileoverview rect
 * @author dengfuping_develop@163.com
 */
import { __assign, __extends } from "tslib";
import { each, isArray } from '@antv/util';
import ShapeBase from './base';
import { SVG_ATTR_MAP } from '../constant';
import { parseRadius } from '../util/format';
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'rect';
        _this.canFill = true;
        _this.canStroke = true;
        return _this;
    }
    Rect.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return __assign(__assign({}, attrs), { x: 0, y: 0, width: 0, height: 0, radius: 0 });
    };
    Rect.prototype.createPath = function (context, targetAttrs) {
        var _this = this;
        var attrs = this.attr();
        var el = this.get('el');
        // 加上状态量，用来标记 path 是否已组装
        var completed = false;
        // 和组装 path 相关的绘图属性
        var pathRelatedAttrs = ['x', 'y', 'width', 'height', 'radius'];
        each(targetAttrs || attrs, function (value, attr) {
            if (pathRelatedAttrs.indexOf(attr) !== -1 && !completed) {
                el.setAttribute('d', _this._assembleRect(attrs));
                completed = true;
            }
            else if (pathRelatedAttrs.indexOf(attr) === -1 && SVG_ATTR_MAP[attr]) {
                el.setAttribute(SVG_ATTR_MAP[attr], value);
            }
        });
    };
    Rect.prototype._assembleRect = function (attrs) {
        var x = attrs.x;
        var y = attrs.y;
        var w = attrs.width;
        var h = attrs.height;
        var radius = attrs.radius;
        if (!radius) {
            return "M " + x + "," + y + " l " + w + ",0 l 0," + h + " l" + -w + " 0 z";
        }
        var r = parseRadius(radius);
        if (isArray(radius)) {
            if (radius.length === 1) {
                r.r1 = r.r2 = r.r3 = r.r4 = radius[0];
            }
            else if (radius.length === 2) {
                r.r1 = r.r3 = radius[0];
                r.r2 = r.r4 = radius[1];
            }
            else if (radius.length === 3) {
                r.r1 = radius[0];
                r.r2 = r.r4 = radius[1];
                r.r3 = radius[2];
            }
            else {
                r.r1 = radius[0];
                r.r2 = radius[1];
                r.r3 = radius[2];
                r.r4 = radius[3];
            }
        }
        else {
            r.r1 = r.r2 = r.r3 = r.r4 = radius;
        }
        var d = [
            ["M " + (x + r.r1) + "," + y],
            ["l " + (w - r.r1 - r.r2) + ",0"],
            ["a " + r.r2 + "," + r.r2 + ",0,0,1," + r.r2 + "," + r.r2],
            ["l 0," + (h - r.r2 - r.r3)],
            ["a " + r.r3 + "," + r.r3 + ",0,0,1," + -r.r3 + "," + r.r3],
            ["l " + (r.r3 + r.r4 - w) + ",0"],
            ["a " + r.r4 + "," + r.r4 + ",0,0,1," + -r.r4 + "," + -r.r4],
            ["l 0," + (r.r4 + r.r1 - h)],
            ["a " + r.r1 + "," + r.r1 + ",0,0,1," + r.r1 + "," + -r.r1],
            ['z'],
        ];
        return d.join(' ');
    };
    return Rect;
}(ShapeBase));
export default Rect;
//# sourceMappingURL=rect.js.map