"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("./base");
var Line = /** @class */ (function (_super) {
    tslib_1.__extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { type: 'line' });
    };
    Line.prototype.getGridPath = function (points) {
        var path = [];
        util_1.each(points, function (point, index) {
            if (index === 0) {
                path.push(['M', point.x, point.y]);
            }
            else {
                path.push(['L', point.x, point.y]);
            }
        });
        return path;
    };
    return Line;
}(base_1.default));
exports.default = Line;
//# sourceMappingURL=line.js.map