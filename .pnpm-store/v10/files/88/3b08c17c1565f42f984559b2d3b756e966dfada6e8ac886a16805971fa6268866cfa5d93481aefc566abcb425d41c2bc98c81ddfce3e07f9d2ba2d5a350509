import { __assign, __extends } from "tslib";
import { each, isArray, isObject } from '@antv/util';
import { SVG_ATTR_MAP } from '../constant';
import ShapeBase from './base';
var Path = /** @class */ (function (_super) {
    __extends(Path, _super);
    function Path() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'path';
        _this.canFill = true;
        _this.canStroke = true;
        return _this;
    }
    Path.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return __assign(__assign({}, attrs), { startArrow: false, endArrow: false });
    };
    Path.prototype.createPath = function (context, targetAttrs) {
        var _this = this;
        var attrs = this.attr();
        var el = this.get('el');
        each(targetAttrs || attrs, function (value, attr) {
            if (attr === 'path' && isArray(value)) {
                el.setAttribute('d', _this._formatPath(value));
            }
            else if (attr === 'startArrow' || attr === 'endArrow') {
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
    Path.prototype._formatPath = function (value) {
        var newValue = value
            .map(function (path) {
            return path.join(' ');
        })
            .join('');
        if (~newValue.indexOf('NaN')) {
            return '';
        }
        return newValue;
    };
    /**
     * Get total length of path
     * 尽管通过浏览器的 SVGPathElement.getTotalLength() 接口获取的 path 长度，
     * 与 Canvas 版本通过数学计算的方式得到的长度有一些细微差异，但最大误差在个位数像素，精度上可以能接受
     * @return {number} length
     */
    Path.prototype.getTotalLength = function () {
        var el = this.get('el');
        return el ? el.getTotalLength() : null;
    };
    /**
     * Get point according to ratio
     * @param {number} ratio
     * @return {Point} point
     */
    Path.prototype.getPoint = function (ratio) {
        var el = this.get('el');
        var totalLength = this.getTotalLength();
        // @see https://github.com/antvis/g/issues/634
        if (totalLength === 0) {
            return null;
        }
        var point = el ? el.getPointAtLength(ratio * totalLength) : null;
        return point
            ? {
                x: point.x,
                y: point.y,
            }
            : null;
    };
    return Path;
}(ShapeBase));
export default Path;
//# sourceMappingURL=path.js.map