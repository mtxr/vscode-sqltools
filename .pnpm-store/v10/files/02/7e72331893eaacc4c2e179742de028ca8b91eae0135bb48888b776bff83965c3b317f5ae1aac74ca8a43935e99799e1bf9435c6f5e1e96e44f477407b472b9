"use strict";
/**
 * @fileoverview ellipse
 * @author dengfuping_develop@163.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var base_1 = require("./base");
var Ellipse = /** @class */ (function (_super) {
    tslib_1.__extends(Ellipse, _super);
    function Ellipse() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ellipse';
        _this.canFill = true;
        _this.canStroke = true;
        return _this;
    }
    Ellipse.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { x: 0, y: 0, rx: 0, ry: 0 });
    };
    Ellipse.prototype.createPath = function (context, targetAttrs) {
        var attrs = this.attr();
        var el = this.get('el');
        util_1.each(targetAttrs || attrs, function (value, attr) {
            // 圆和椭圆的点坐标属性不是 x, y，而是 cx, cy
            if (attr === 'x' || attr === 'y') {
                el.setAttribute("c" + attr, value);
            }
            else if (constant_1.SVG_ATTR_MAP[attr]) {
                el.setAttribute(constant_1.SVG_ATTR_MAP[attr], value);
            }
        });
    };
    return Ellipse;
}(base_1.default));
exports.default = Ellipse;
//# sourceMappingURL=ellipse.js.map