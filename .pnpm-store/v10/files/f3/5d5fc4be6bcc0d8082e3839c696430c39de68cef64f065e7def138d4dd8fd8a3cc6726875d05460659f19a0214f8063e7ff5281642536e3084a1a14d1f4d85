/**
 * @fileoverview ellipse
 * @author dengfuping_develop@163.com
 */
import { __assign, __extends } from "tslib";
import { each } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';
var Ellipse = /** @class */ (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ellipse';
        _this.canFill = true;
        _this.canStroke = true;
        return _this;
    }
    Ellipse.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return __assign(__assign({}, attrs), { x: 0, y: 0, rx: 0, ry: 0 });
    };
    Ellipse.prototype.createPath = function (context, targetAttrs) {
        var attrs = this.attr();
        var el = this.get('el');
        each(targetAttrs || attrs, function (value, attr) {
            // 圆和椭圆的点坐标属性不是 x, y，而是 cx, cy
            if (attr === 'x' || attr === 'y') {
                el.setAttribute("c" + attr, value);
            }
            else if (SVG_ATTR_MAP[attr]) {
                el.setAttribute(SVG_ATTR_MAP[attr], value);
            }
        });
    };
    return Ellipse;
}(ShapeBase));
export default Ellipse;
//# sourceMappingURL=ellipse.js.map