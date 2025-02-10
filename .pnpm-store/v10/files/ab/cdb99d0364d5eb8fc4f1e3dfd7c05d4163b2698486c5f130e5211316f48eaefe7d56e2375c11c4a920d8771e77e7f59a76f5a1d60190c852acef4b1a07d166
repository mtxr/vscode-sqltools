"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var base_1 = require("./base");
var Path = /** @class */ (function (_super) {
    tslib_1.__extends(Path, _super);
    function Path() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'path';
        _this.canFill = true;
        _this.canStroke = true;
        return _this;
    }
    Path.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { startArrow: false, endArrow: false });
    };
    Path.prototype.createPath = function (context, targetAttrs) {
        var _this = this;
        var attrs = this.attr();
        var el = this.get('el');
        util_1.each(targetAttrs || attrs, function (value, attr) {
            if (attr === 'path' && util_1.isArray(value)) {
                el.setAttribute('d', _this._formatPath(value));
            }
            else if (attr === 'startArrow' || attr === 'endArrow') {
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
}(base_1.default));
exports.default = Path;
//# sourceMappingURL=path.js.map