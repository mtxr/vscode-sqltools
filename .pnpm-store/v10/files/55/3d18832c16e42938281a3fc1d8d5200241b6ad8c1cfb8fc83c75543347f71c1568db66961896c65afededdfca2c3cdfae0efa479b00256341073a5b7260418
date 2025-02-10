"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @fileoverview polygon
 * @author dengfuping_develop@163.com
 */
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var base_1 = require("./base");
var Polygon = /** @class */ (function (_super) {
    tslib_1.__extends(Polygon, _super);
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
        util_1.each(targetAttrs || attrs, function (value, attr) {
            if (attr === 'points' && util_1.isArray(value) && value.length >= 2) {
                el.setAttribute('points', value.map(function (point) { return point[0] + "," + point[1]; }).join(' '));
            }
            else if (constant_1.SVG_ATTR_MAP[attr]) {
                el.setAttribute(constant_1.SVG_ATTR_MAP[attr], value);
            }
        });
    };
    return Polygon;
}(base_1.default));
exports.default = Polygon;
//# sourceMappingURL=polygon.js.map