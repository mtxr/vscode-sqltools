"use strict";
/**
 * @fileoverview marker
 * @author dengfuping_develop@163.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
var symbols_1 = require("./symbols");
var Marker = /** @class */ (function (_super) {
    tslib_1.__extends(Marker, _super);
    function Marker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'marker';
        _this.canFill = true;
        _this.canStroke = true;
        return _this;
    }
    Marker.prototype.createPath = function (context) {
        var el = this.get('el');
        el.setAttribute('d', this._assembleMarker());
    };
    Marker.prototype._assembleMarker = function () {
        var d = this._getPath();
        if (util_1.isArray(d)) {
            return d
                .map(function (path) {
                return path.join(' ');
            })
                .join('');
        }
        return d;
    };
    Marker.prototype._getPath = function () {
        var attrs = this.attr();
        var x = attrs.x, y = attrs.y;
        // 兼容 r 和 radius 两种写法，推荐使用 r
        var r = attrs.r || attrs.radius;
        var symbol = attrs.symbol || 'circle';
        var method;
        if (util_1.isFunction(symbol)) {
            method = symbol;
        }
        else {
            method = symbols_1.default.get(symbol);
        }
        if (!method) {
            console.warn(method + " symbol is not exist.");
            return null;
        }
        return method(x, y, r);
    };
    // 作为其静态属性
    Marker.symbolsFactory = symbols_1.default;
    return Marker;
}(base_1.default));
exports.default = Marker;
//# sourceMappingURL=index.js.map