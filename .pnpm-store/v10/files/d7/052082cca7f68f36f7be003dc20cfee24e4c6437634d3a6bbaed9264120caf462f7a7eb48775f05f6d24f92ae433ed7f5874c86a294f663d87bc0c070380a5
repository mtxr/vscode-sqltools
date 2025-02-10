import { __extends } from "tslib";
/**
 * @fileoverview polygon
 * @author dengfuping_develop@163.com
 */
import { each, isArray } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';
var Polygon = /** @class */ (function (_super) {
    __extends(Polygon, _super);
    function Polygon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'polygon';
        _this.canFill = true;
        _this.canStroke = true;
        return _this;
    }
    Polygon.prototype.createPath = function (context, targetAttrs) {
        var attrs = this.attr();
        var el = this.get('el');
        each(targetAttrs || attrs, function (value, attr) {
            if (attr === 'points' && isArray(value) && value.length >= 2) {
                el.setAttribute('points', value.map(function (point) { return point[0] + "," + point[1]; }).join(' '));
            }
            else if (SVG_ATTR_MAP[attr]) {
                el.setAttribute(SVG_ATTR_MAP[attr], value);
            }
        });
    };
    return Polygon;
}(ShapeBase));
export default Polygon;
//# sourceMappingURL=polygon.js.map