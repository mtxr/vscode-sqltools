/**
 * @fileoverview marker
 * @author dengfuping_develop@163.com
 */
import { __extends } from "tslib";
import { isArray, isFunction } from '@antv/util';
import ShapeBase from '../base';
import symbolsFactory from './symbols';
var Marker = /** @class */ (function (_super) {
    __extends(Marker, _super);
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
        if (isArray(d)) {
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
        if (isFunction(symbol)) {
            method = symbol;
        }
        else {
            method = symbolsFactory.get(symbol);
        }
        if (!method) {
            console.warn(method + " symbol is not exist.");
            return null;
        }
        return method(x, y, r);
    };
    // 作为其静态属性
    Marker.symbolsFactory = symbolsFactory;
    return Marker;
}(ShapeBase));
export default Marker;
//# sourceMappingURL=index.js.map